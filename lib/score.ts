export type QuestionResult = {
  correct: boolean
  awarded: number
  base: number
  multiplier: string
  totalScore: number
  rank: number
  behindNext: number
  chosenLetter: string
  chosenText: string
}

export function lastAnswerStorageKey(code: string) {
  return `gf_last_answer_${code}`
}

export function speedMultiplier(timeRemaining: number, timerSeconds: number): number {
  const limit = Math.max(1, timerSeconds)
  const remaining = Math.max(0, Math.min(limit, timeRemaining))
  return 0.5 + 0.5 * (remaining / limit)
}

export function awardPoints(
  basePoints: number,
  timeRemaining: number,
  timerSeconds: number,
  correct: boolean,
): number {
  if (!correct) return 0
  return Math.max(1, Math.round(basePoints * speedMultiplier(timeRemaining, timerSeconds)))
}

export function rankPlayers<T extends { score: number }>(players: T[]): (T & { rank: number })[] {
  const sorted = [...players].sort((a, b) => b.score - a.score)
  return sorted.map((p, i) => ({ ...p, rank: i + 1 }))
}
