import { createAnonClient, createServerSupabase, createServiceClient } from '@/lib/supabase/server'
import { choiceLabel } from '@/lib/choice-label'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

function normalizeDifficulty(value: string | null): Difficulty {
  return value === 'Easy' || value === 'Hard' ? value : 'Medium'
}

export type QuizChoice = { label: string; text: string; correct: boolean }

function parseChoices(options: unknown): QuizChoice[] {
  if (!Array.isArray(options)) return []
  return options.map((item, i) => {
    const label = choiceLabel(i)
    if (typeof item === 'string') {
      return { label, text: item, correct: false }
    }
    if (item && typeof item === 'object') {
      const rec = item as { label?: string; text?: string; correct?: boolean }
      return {
        label: rec.label?.trim() || label,
        text: rec.text ?? '',
        correct: Boolean(rec.correct),
      }
    }
    return { label, text: '', correct: false }
  })
}

export type QuizQuestion = {
  id: string
  text: string
  imageUrl: string | null
  choices: QuizChoice[]
  timerSeconds: number
  points: number
  orderIndex: number
}

export type QuizSummary = {
  id: string
  title: string
  description: string | null
  category: string | null
  subtags: string[]
  difficulty: Difficulty
  coverImageUrl: string | null
  questionCount: number
  minutes: number
}

export type QuizWithQuestions = QuizSummary & { questions: QuizQuestion[] }

export type QuizStatus = 'published' | 'draft'

export type MyQuiz = {
  id: string
  title: string
  category: string | null
  difficulty: Difficulty
  coverImageUrl: string | null
  status: QuizStatus
  questionCount: number
  createdAt: string
}

// Quizzes owned by the currently signed-in user (drafts + published).
// Uses the authenticated cookie client so RLS scopes rows to auth.uid().
// Returns an empty array when signed out.
export async function getMyQuizzes(): Promise<MyQuiz[]> {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, category, difficulty, cover_image_url, status, created_at, questions(id)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    difficulty: normalizeDifficulty(row.difficulty),
    coverImageUrl: row.cover_image_url,
    status: row.status === 'published' ? 'published' : 'draft',
    questionCount: Array.isArray(row.questions) ? row.questions.length : 0,
    createdAt: row.created_at,
  }))
}

export type EditableQuiz = {
  id: string
  title: string
  description: string | null
  category: string | null
  subtags: string[]
  difficulty: Difficulty
  coverImageUrl: string | null
  status: QuizStatus
  questions: QuizQuestion[]
}

// A single quiz owned by the current user (any status) plus its ordered
// questions, for the create/edit flow. RLS scopes it to the owner.
export async function getMyQuizForEdit(id: string): Promise<EditableQuiz | null> {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('quizzes')
    .select(
      'id, title, description, category, subtags, difficulty, cover_image_url, status, questions(id, text, image_url, options, timer_seconds, points, order_index)',
    )
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const rawQuestions = (data.questions ?? []) as {
    id: string
    text: string
    image_url: string | null
    options: QuizChoice[]
    timer_seconds: number
    points: number
    order_index: number
  }[]

  const questions: QuizQuestion[] = rawQuestions
    .map((q) => ({
      id: q.id,
      text: q.text,
      imageUrl: q.image_url,
      choices: parseChoices(q.options),
      timerSeconds: q.timer_seconds,
      points: q.points,
      orderIndex: q.order_index,
    }))
    .sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    subtags: data.subtags ?? [],
    difficulty: normalizeDifficulty(data.difficulty),
    coverImageUrl: data.cover_image_url,
    status: data.status === 'published' ? 'published' : 'draft',
    questions,
  }
}

function minutesFromSeconds(totalSeconds: number, questionCount: number): number {
  // Fall back to a rough estimate if timers are missing.
  const seconds = totalSeconds > 0 ? totalSeconds : questionCount * 20
  return Math.max(1, Math.round(seconds / 60))
}

// Published quizzes for the Library, with a question count and estimated
// play time derived from each quiz's question timers.
export async function getPublishedQuizzes(): Promise<QuizSummary[]> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      'id, title, description, category, subtags, difficulty, cover_image_url, questions(timer_seconds)',
    )
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  if (error) throw error

  const plays = await getQuizPlayCounts()
  return (data ?? [])
    .map((row) => {
      const questions = (row.questions ?? []) as { timer_seconds: number }[]
      const totalSeconds = questions.reduce((sum, q) => sum + (q.timer_seconds ?? 0), 0)
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        subtags: row.subtags ?? [],
        difficulty: normalizeDifficulty(row.difficulty),
        coverImageUrl: row.cover_image_url,
        questionCount: questions.length,
        minutes: minutesFromSeconds(totalSeconds, questions.length),
      }
    })
    .sort((a, b) => {
      const playDelta = (plays.get(b.id) ?? 0) - (plays.get(a.id) ?? 0)
      if (playDelta !== 0) return playDelta
      return b.questionCount - a.questionCount
    })
}

// Resolve a published quiz id by its exact title. Used to bridge the static
// landing-page deck links (?deck=<slug>) to real DB quiz ids.
export async function getPublishedQuizIdByTitle(title: string): Promise<string | null> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select('id')
    .eq('status', 'published')
    .eq('title', title)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data?.id ?? null
}

// A single published quiz plus its ordered questions, for the host preview.
export async function getQuizWithQuestions(id: string): Promise<QuizWithQuestions | null> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      'id, title, description, category, subtags, difficulty, cover_image_url, status, questions(id, text, image_url, options, timer_seconds, points, order_index)',
    )
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const rawQuestions = (data.questions ?? []) as {
    id: string
    text: string
    image_url: string | null
    options: QuizChoice[]
    timer_seconds: number
    points: number
    order_index: number
  }[]

  const questions: QuizQuestion[] = rawQuestions
    .map((q) => ({
      id: q.id,
      text: q.text,
      imageUrl: q.image_url,
      choices: parseChoices(q.options),
      timerSeconds: q.timer_seconds,
      points: q.points,
      orderIndex: q.order_index,
    }))
    .sort((a, b) => a.orderIndex - b.orderIndex)

  const totalSeconds = questions.reduce((sum, q) => sum + (q.timerSeconds ?? 0), 0)

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    subtags: data.subtags ?? [],
    difficulty: normalizeDifficulty(data.difficulty),
    coverImageUrl: data.cover_image_url,
    questionCount: questions.length,
    minutes: minutesFromSeconds(totalSeconds, questions.length),
    questions,
  }
}

async function getQuizPlayCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>()
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('rooms').select('quiz_id')
    if (error || !data) return counts
    for (const row of data) {
      if (!row.quiz_id) continue
      counts.set(row.quiz_id, (counts.get(row.quiz_id) ?? 0) + 1)
    }
  } catch {
    // No service role (local) or rooms unreadable — featured falls back to catalog order.
  }
  return counts
}

// Homepage featured row: published quizzes ranked by how many rooms were hosted.
export async function getMostPlayedPublishedQuizzes(limit = 4): Promise<QuizSummary[]> {
  const quizzes = await getPublishedQuizzes()
  return quizzes.slice(0, limit)
}
