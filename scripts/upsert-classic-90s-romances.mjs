import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const LETTERS = ['A', 'B', 'C', 'D']

function loadEnvFile(raw) {
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

try {
  loadEnvFile(await readFile(resolve('.env.local'), 'utf8'))
} catch {
  // Fall through to process.env from the shell / Vercel pull.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.warn('Skipping quiz upsert: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(0)
}

const pack = JSON.parse(await readFile(resolve('content/classic-90s-romances.json'), 'utf8'))
const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: quiz, error: quizError } = await supabase
  .from('quizzes')
  .select('id, title')
  .eq('title', pack.title)
  .eq('status', 'published')
  .maybeSingle()

if (quizError) throw quizError
if (!quiz) throw new Error(`Published quiz not found: ${pack.title}`)

const { error: updateError } = await supabase
  .from('quizzes')
  .update({
    description: pack.description,
    category: pack.category,
    difficulty: pack.difficulty,
  })
  .eq('id', quiz.id)

if (updateError) throw updateError

const { error: deleteError } = await supabase.from('questions').delete().eq('quiz_id', quiz.id)
if (deleteError) throw deleteError

const rows = pack.questions.map((q, i) => {
  const correct = String(q.correct).trim().toUpperCase()
  const correctIndex = LETTERS.indexOf(correct)
  if (correctIndex < 0 || q.options.length !== 4) {
    throw new Error(`Question ${i + 1} needs A–D options and CORRECT A/B/C/D`)
  }
  return {
    quiz_id: quiz.id,
    text: q.text,
    image_url: null,
    options: q.options.map((text, oi) => ({
      label: LETTERS[oi],
      text,
      correct: oi === correctIndex,
    })),
    timer_seconds: 20,
    points: 250,
    order_index: i,
  }
})

const { error: insertError } = await supabase.from('questions').insert(rows)
if (insertError) throw insertError

console.log(`Updated "${pack.title}" with ${rows.length} questions (quiz ${quiz.id})`)
