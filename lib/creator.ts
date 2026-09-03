export type CreatorStep = {
  n: number
  label: string
  href: string
}

export const CREATOR_STEPS: CreatorStep[] = [
  { n: 1, label: 'Quiz Settings', href: '/create/details' },
  { n: 2, label: 'Add Questions', href: '/create/questions' },
  { n: 3, label: 'Review & Publish', href: '/create/review' },
]

// Draft questions used to seed the editor + review screens (DDLJ set).
export type DraftChoice = {
  label: string
  text: string
}

export type DraftQuestion = {
  prompt: string
  choices: DraftChoice[]
  correctIndex: number
  timer: number
  points: number
}

export const DRAFT_QUESTIONS: DraftQuestion[] = [
  {
    prompt: 'In DDLJ, where does Simran first meet Raj Malhotra?',
    choices: [
      { label: 'A', text: 'At the ticket counter in London Kings Cross' },
      { label: 'B', text: 'On the platform of London St. Pancras as they board the train' },
      { label: 'C', text: 'Inside a shared gondola in Switzerland' },
    ],
    correctIndex: 1,
    timer: 20,
    points: 250,
  },
  {
    prompt: 'Who sang the hit song "Tujhe Dekha Toh Yeh Jaana Sanam"?',
    choices: [
      { label: 'A', text: 'Kumar Sanu & Lata Mangeshkar' },
      { label: 'B', text: 'Udit Narayan & Alka Yagnik' },
    ],
    correctIndex: 0,
    timer: 15,
    points: 100,
  },
  {
    prompt: 'Which Swiss city has the statue of Yash Chopra?',
    choices: [
      { label: 'A', text: 'Interlaken' },
      { label: 'B', text: 'Gstaad' },
      { label: 'C', text: 'Zurich' },
    ],
    correctIndex: 0,
    timer: 20,
    points: 250,
  },
]

export const REVIEW_STATS = {
  difficulty: 'Medium',
  tag: 'Bollywood 90s',
  totalQuestions: 15,
  duration: 'Approx. 10 mins',
  maxXp: '3,750 XP',
}
