export const QUIZ_CATEGORIES = [
  { label: 'Bollywood', value: 'Bollywood Cinema', emoji: '\u{1F3AC}' },
  { label: 'Hollywood', value: 'Hollywood', emoji: '\u{1F3A5}' },
  { label: 'TV Series', value: 'TV Series', emoji: '\u{1F4FA}' },
  { label: 'Sports', value: 'Sports', emoji: '\u{1F3C6}' },
] as const

export type QuizCategory = (typeof QUIZ_CATEGORIES)[number]

const BOLLYWOOD = QUIZ_CATEGORIES[0]

type Categorized = { category: string | null; subtags: string[] }

function blob(quiz: Categorized): string {
  return [quiz.category, ...quiz.subtags].filter(Boolean).join(' ').toLowerCase()
}

function mentions(quiz: Categorized, cat: QuizCategory): boolean {
  const hay = blob(quiz)
  return hay.includes(cat.value.toLowerCase()) || hay.includes(cat.label.toLowerCase())
}

// Legacy packs were stored as Romance / Music / Action / etc. Those are Bollywood
// unless they explicitly name Hollywood, TV Series, or Sports.
export function resolveQuizCategory(quiz: Categorized): QuizCategory {
  for (const cat of QUIZ_CATEGORIES) {
    if (cat.value === BOLLYWOOD.value) continue
    if (mentions(quiz, cat)) return cat
  }
  return BOLLYWOOD
}

export function quizMatchesCategory(quiz: Categorized, selected: QuizCategory | null): boolean {
  if (!selected) return true
  return resolveQuizCategory(quiz).value === selected.value
}
