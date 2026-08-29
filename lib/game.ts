export type AnswerStyle = {
  id: 'a' | 'b' | 'c' | 'd'
  color: string
  soft: string
  shape: 'triangle' | 'diamond' | 'circle' | 'square'
}

// Four distinct answer tiles (color + shape), drawn from the GatherFlix
// avatar palette so the game stays on-brand while keeping options
// instantly distinguishable.
export const ANSWER_STYLES: AnswerStyle[] = [
  { id: 'a', color: '#ec1b78', soft: 'rgb(236 27 120 / 16%)', shape: 'triangle' },
  { id: 'b', color: '#f2a32e', soft: 'rgb(242 163 46 / 16%)', shape: 'diamond' },
  { id: 'c', color: '#00b8d4', soft: 'rgb(0 184 212 / 16%)', shape: 'circle' },
  { id: 'd', color: '#8f3df0', soft: 'rgb(143 61 240 / 16%)', shape: 'square' },
]

export type Question = {
  prompt: string
  options: string[]
  correctIndex: number
  category: string
}

export const SAMPLE_QUESTION: Question = {
  category: 'Dialogs',
  prompt: 'Complete the legendary line: "Kitne aadmi ___?"',
  options: ['The', 'The?', 'Hai', 'Kahan'],
  correctIndex: 1,
}

export const GAME_META = {
  questionNumber: 3,
  totalQuestions: 50,
  timerSeconds: 20,
  lastPoints: 850,
  playerCount: 18,
  rankAfterCorrect: 2,
  rankAfterWrong: 5,
}

// Answer distribution for the reveal screen (counts per option).
export const ANSWER_DISTRIBUTION = [3, 12, 2, 1]

export const LEADERBOARD = [
  { name: 'Priya', styleId: 'masala', score: 4200 },
  { name: 'Arjun', styleId: 'neon', score: 3850 },
  { name: 'Meera', styleId: 'royal', score: 3600 },
  { name: 'Dev', styleId: 'gold', score: 3100 },
  { name: 'Sana', styleId: 'chili', score: 2900 },
]

// Final standings shown on the podium screen at game end.
export type FinalPlayer = {
  name: string
  styleId: string
  score: number
  correct: number
}

export const FINAL_RESULTS: FinalPlayer[] = [
  { name: 'Priya', styleId: 'masala', score: 18450, correct: 44 },
  { name: 'Arjun', styleId: 'neon', score: 16820, correct: 41 },
  { name: 'Meera', styleId: 'royal', score: 15300, correct: 38 },
  { name: 'Dev', styleId: 'gold', score: 13900, correct: 35 },
  { name: 'Sana', styleId: 'chili', score: 12650, correct: 33 },
  { name: 'Rohan', styleId: 'neon', score: 11200, correct: 30 },
  { name: 'Ananya', styleId: 'royal', score: 10450, correct: 28 },
  { name: 'Karan', styleId: 'mint', score: 9800, correct: 26 },
]

export const GAME_SUMMARY = {
  deckTitle: 'Sholay Masala Night',
  totalQuestions: 50,
  playerCount: 18,
}
