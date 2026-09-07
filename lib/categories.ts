export const QUIZ_CATEGORIES = [
  { label: 'Bollywood', value: 'Bollywood Cinema', emoji: '\u{1F3AC}' },
  { label: 'Hollywood', value: 'Hollywood', emoji: '\u{1F3A5}' },
  { label: 'TV Series', value: 'TV Series', emoji: '\u{1F4FA}' },
  { label: 'Sports', value: 'Sports', emoji: '\u{1F3C6}' },
] as const

export type QuizCategory = (typeof QUIZ_CATEGORIES)[number]

export function quizMatchesCategory(
  quiz: { category: string | null; subtags: string[] },
  selected: QuizCategory | null,
): boolean {
  if (!selected) return true
  const hay = [quiz.category, ...quiz.subtags].filter(Boolean).join(' ').toLowerCase()
  const value = selected.value.toLowerCase()
  const label = selected.label.toLowerCase()
  return hay.includes(value) || hay.includes(label)
}
