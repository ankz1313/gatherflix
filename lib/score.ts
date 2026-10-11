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

export const LATE_CORRECT_POINTS = 100

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
  if (timeRemaining <= 0) return LATE_CORRECT_POINTS
  return Math.max(1, Math.round(basePoints * speedMultiplier(timeRemaining, timerSeconds)))
}

export function rankPlayers<T extends { score: number }>(players: T[]): (T & { rank: number })[] {
  const sorted = [...players].sort((a, b) => b.score - a.score)
  return sorted.map((p, i) => ({ ...p, rank: i + 1 }))
}

export function standingFor<T extends { score: number }>(
  players: T[],
  isMe: (player: T) => boolean,
): { rank: number; score: number; behindNext: number } | null {
  const ranked = rankPlayers(players)
  const myIndex = ranked.findIndex(isMe)
  if (myIndex < 0) return null
  const me = ranked[myIndex]
  const ahead = myIndex > 0 ? ranked[myIndex - 1] : null
  return {
    rank: me.rank,
    score: me.score,
    behindNext: ahead ? Math.max(0, ahead.score - me.score) : 0,
  }
}
