'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

export type QuestionInput = {
  text: string
  imageUrl: string | null
  options: { label: string; text: string; correct: boolean }[]
  timerSeconds: number
  points: number
}

type QuizDetailsInput = {
  quizId?: string
  title: string
  description: string
  category: string
  subtags: string[]
  difficulty: string
  coverImageUrl: string | null
}

async function getSessionClient() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

// Step 1: create a new draft quiz (or update an existing one's details).
// Returns the quiz id so the client can advance to the questions step.
export async function saveQuizDetails(
  input: QuizDetailsInput,
): Promise<{ ok: true; quizId: string } | { ok: false; error: string }> {
  const { supabase, user } = await getSessionClient()
  if (!user) return { ok: false, error: 'Please sign in to create a quiz.' }

  const title = input.title.trim()
  if (!title) return { ok: false, error: 'Please enter a quiz title.' }

  const fields = {
    title,
    description: input.description.trim() || null,
    category: input.category,
    subtags: input.subtags,
    difficulty: input.difficulty,
    cover_image_url: input.coverImageUrl,
  }

  if (input.quizId) {
    const { error } = await supabase
      .from('quizzes')
      .update(fields)
      .eq('id', input.quizId)
      .eq('owner_id', user.id)
    if (error) return { ok: false, error: error.message }
    return { ok: true, quizId: input.quizId }
  }

  const { data, error } = await supabase
    .from('quizzes')
    .insert({ ...fields, owner_id: user.id, status: 'draft' })
    .select('id')
    .single()
  if (error) return { ok: false, error: error.message }

  revalidatePath('/create')
  return { ok: true, quizId: data.id }
}

// Step 2: replace the quiz's questions with the current editor set.
// Deletes existing rows and re-inserts in order so edits, adds, and
// removals all persist deterministically.
export async function saveQuizQuestions(
  quizId: string,
  questions: QuestionInput[],
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, user } = await getSessionClient()
  if (!user) return { ok: false, error: 'Please sign in to save questions.' }

  const { data: owned } = await supabase
    .from('quizzes')
    .select('id')
    .eq('id', quizId)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!owned) return { ok: false, error: 'Quiz not found.' }

  const { error: deleteError } = await supabase.from('questions').delete().eq('quiz_id', quizId)
  if (deleteError) return { ok: false, error: deleteError.message }

  if (questions.length > 0) {
    const rows = questions.map((q, i) => ({
      quiz_id: quizId,
      text: q.text,
      image_url: q.imageUrl,
      options: q.options,
      timer_seconds: q.timerSeconds,
      points: q.points,
      order_index: i,
    }))
    const { error: insertError } = await supabase.from('questions').insert(rows)
    if (insertError) return { ok: false, error: insertError.message }
  }

  revalidatePath('/create')
  return { ok: true }
}

// Step 3: publish or revert to draft. Publishing requires at least one
// question; otherwise the user is sent back to the questions step.
export async function setQuizStatus(quizId: string, status: 'published' | 'draft') {
  const { supabase, user } = await getSessionClient()
  if (!user) redirect('/login?redirectedFrom=/create')

  if (status === 'published') {
    const { count } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('quiz_id', quizId)
    if (!count || count === 0) {
      redirect(`/create/questions?quiz=${quizId}`)
    }
  }

  await supabase.from('quizzes').update({ status }).eq('id', quizId).eq('owner_id', user.id)

  revalidatePath('/create')
  redirect('/create')
}
