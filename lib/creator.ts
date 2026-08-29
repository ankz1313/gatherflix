export type CreatorStep = {
  n: number
  label: string
  href: string
}

export const CREATOR_STEPS: CreatorStep[] = [
  { n: 1, label: 'Details', href: '/create/details' },
  { n: 2, label: 'Questions', href: '/create/questions' },
  { n: 3, label: 'Review', href: '/create/review' },
]

// A creator's existing decks shown on the dashboard.
export type CreatorDeck = {
  title: string
  status: 'Published' | 'Draft'
  questions: number
  plays: string
  updated: string
}

export const MY_DECKS: CreatorDeck[] = [
  { title: 'Sholay Masala Night', status: 'Published', questions: 50, plays: '12.4k', updated: '2 days ago' },
  { title: '90s Sangeet Superhits', status: 'Published', questions: 45, plays: '9.8k', updated: '1 week ago' },
  { title: 'Monsoon Romance Mixtape', status: 'Draft', questions: 12, plays: '—', updated: '3 hours ago' },
]

export const CREATOR_STATS = [
  { label: 'Total decks', value: '3' },
  { label: 'Total plays', value: '22.2k' },
  { label: 'Avg. rating', value: '4.8' },
]

// Draft questions used to seed the editor + review screens.
export type DraftQuestion = {
  prompt: string
  options: string[]
  correctIndex: number
}

export const DRAFT_QUESTIONS: DraftQuestion[] = [
  {
    prompt: 'Which 1975 film features the iconic "Kitne aadmi the?" dialogue?',
    options: ['Sholay', 'Deewaar', 'Zanjeer', 'Don'],
    correctIndex: 0,
  },
  {
    prompt: 'Who played the character Gabbar Singh?',
    options: ['Amjad Khan', 'Amrish Puri', 'Pran', 'Danny D.'],
    correctIndex: 0,
  },
  {
    prompt: 'What is the name of the coin Jai flips throughout the film?',
    options: ['A two-headed coin', 'A lucky rupee', 'A gold mohur', 'A silver anna'],
    correctIndex: 0,
  },
]
