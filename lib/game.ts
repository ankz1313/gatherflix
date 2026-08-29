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
  points: number
  image: string
  imageAlt: string
}

export const SAMPLE_QUESTION: Question = {
  category: 'Bollywood Blockbusters',
  prompt: 'Which film won the Filmfare Best Film award in 2023?',
  options: ['Brahm\u0101stra', 'Gangubai Kathiawadi', 'Bhool Bhulaiyaa 2', 'The Kashmir Files'],
  correctIndex: 1,
  points: 500,
  image: '/game/question-still.png',
  imageAlt: 'Dancers performing in a golden-lit palace courtyard',
}

export const GAME_META = {
  questionNumber: 7,
  totalQuestions: 20,
  timerSeconds: 15,
  playersLockedIn: 12,
  playerCount: 16,
  round: 7,
  lastPoints: 850,
  rankAfterCorrect: 2,
  rankAfterWrong: 5,
}

// Answer distribution for the reveal screen (counts per option).
export const ANSWER_DISTRIBUTION = [1, 12, 3, 0]

// Live "Top 5 Stars" leaderboard with emoji avatars and per-round deltas.
export type StarPlayer = {
  name: string
  emoji: string
  score: number
  delta: number
  host?: boolean
}

export const STAR_LEADERBOARD: StarPlayer[] = [
  { name: 'Rahul (Host)', emoji: '\u{1F60E}', score: 6450, delta: 480, host: true },
  { name: 'Pooja', emoji: '\u{1F483}', score: 5890, delta: 420 },
  { name: 'Simran', emoji: '\u2728', score: 5220, delta: 410 },
  { name: 'Veeru', emoji: '\u{1F9D4}', score: 4950, delta: 390 },
  { name: 'Jai', emoji: '\u{1F934}', score: 4110, delta: 0 },
]

export const LEADERBOARD = [
  { name: 'Priya', styleId: 'masala', score: 4200 },
  { name: 'Arjun', styleId: 'neon', score: 3850 },
  { name: 'Meera', styleId: 'royal', score: 3600 },
  { name: 'Dev', styleId: 'gold', score: 3100 },
  { name: 'Sana', styleId: 'chili', score: 2900 },
]

// Personal per-question result shown on the player's phone after a round.
export const MOBILE_RESULT = {
  chosenLetter: 'B',
  chosenText: 'Gangubai Kathiawadi',
  correct: {
    points: 420,
    base: 300,
    multiplier: '1.4x',
    rank: 3,
    totalScore: 5220,
    behindNext: -670,
  },
  wrong: {
    points: 0,
    base: 0,
    multiplier: '0x',
    rank: 8,
    totalScore: 4110,
    behindNext: -840,
  },
}

// Final standings shown on the podium screen at game end.
export type FinalPlayer = {
  name: string
  emoji: string
  title: string
  score: number
  correct: number
}

export const FINAL_RESULTS: FinalPlayer[] = [
  { name: 'Rahul', emoji: '\u{1F60E}', title: 'Party Host', score: 6450, correct: 14 },
  { name: 'Priya', emoji: '\u{1F483}', title: 'Dance Diva', score: 5890, correct: 13 },
  { name: 'Simran', emoji: '\u2728', title: 'Quick-Fire Queen', score: 5220, correct: 13 },
  { name: 'Jai', emoji: '\u{1F934}', title: 'Classic Fan', score: 4110, correct: 11 },
  { name: 'Veeru', emoji: '\u{1F9D4}', title: 'Basanti Lover', score: 3850, correct: 10 },
  { name: 'Karan', emoji: '\u{1F37F}', title: 'Drama King', score: 3400, correct: 9 },
  { name: 'Don', emoji: '\u{1F576}\uFE0F', title: 'Catch Me If You Can', score: 2910, correct: 8 },
]

export const GAME_SUMMARY = {
  quizTitle: 'Shah Rukh Fanatic Quiz',
  deckTitle: 'Classic 90s Romances',
  sessionId: '4829',
  questionsCompleted: 15,
  totalQuestions: 15,
  playerCount: 7,
  partyRoom: 'DDLJ',
}
