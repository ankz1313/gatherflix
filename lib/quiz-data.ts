import { createAnonClient } from '@/lib/supabase/server'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

function normalizeDifficulty(value: string | null): Difficulty {
  return value === 'Easy' || value === 'Hard' ? value : 'Medium'
}

export type QuizChoice = { label: string; text: string; correct: boolean }

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

  return (data ?? []).map((row) => {
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
      choices: Array.isArray(q.options) ? q.options : [],
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
