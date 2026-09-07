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

// Question shape used by the create/edit editor UI.
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
