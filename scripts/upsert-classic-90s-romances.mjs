import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

function choiceLabel(index) {
  let n = index + 1
  let out = ''
  while (n > 0) {
    const rem = (n - 1) % 26
    out = String.fromCharCode(65 + rem) + out
    n = Math.floor((n - 1) / 26)
  }
  return out || 'A'
}

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

try {
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
    const options = Array.isArray(q.options) ? q.options : []
    if (options.length < 2) {
      throw new Error(`Question ${i + 1} needs at least 2 options`)
    }
    const correctIndex = options.findIndex((_, oi) => choiceLabel(oi) === correct)
    if (correctIndex < 0) {
      throw new Error(`Question ${i + 1} has an invalid CORRECT letter: ${correct}`)
    }
    return {
      quiz_id: quiz.id,
      text: q.text,
      image_url: null,
      options: options.map((text, oi) => ({
        label: choiceLabel(oi),
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
} catch (err) {
  console.error('Quiz upsert failed; the site build can still deploy:', err)
  process.exit(0)
}
