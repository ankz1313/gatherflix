export type DeckTag = 'Trending' | 'Classics' | 'Music' | 'Romance' | 'Action' | 'Comedy'

export type PreviewOption = {
  label: string
  text: string
}

export type Deck = {
  slug: string
  title: string
  blurb: string
  image: string
  alt: string
  questionCount: number
  minutes: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  categories: string[]
  creator: string
  host: string
  plays: string
  preview: {
    question: string
    options: PreviewOption[]
    correctIndex: number
    points: number
    tip?: string
  }
  sampleQuestions: string[]
  tags: DeckTag[]
  trending?: boolean
  featured?: boolean
}

export const DECKS: Deck[] = [
  {
    slug: 'classic-90s-romances',
    title: 'Classic 90s Romances',
    blurb:
      "Bade bade deshon mein aisi chhoti chhoti baatein toh hoti hi rehti hain! Test your gang's memory on the golden decade of love, yellow mustard fields, and timeless tunes from DDLJ, Kuch Kuch Hota Hai, and Hum Aapke Hain Koun.",
    image: '/decks/deck-classic-90s-romance.png',
    alt: 'Couple in traditional attire in a golden mustard field at sunset',
    questionCount: 15,
    minutes: 10,
    difficulty: 'Medium',
    categories: ['DDLJ', 'SRK', '90s'],
    creator: 'ShranFan99',
    host: 'ShranFan99',
    plays: '2.4K',
    preview: {
      question:
        "In DDLJ, what does Raj's father gift him upon failing his university exams in London?",
      options: [
        { label: 'A', text: 'A classic red Harley Davidson motorcycle' },
        { label: 'B', text: 'A month-long trip across Europe (EuroRail pass)' },
        { label: 'C', text: 'A luxury apartment in Mayfair, London' },
        { label: 'D', text: 'An premium film camera to pursue his passion' },
      ],
      correctIndex: 1,
      points: 100,
      tip: 'This deck has 3 rapid-fire audio clip questions. Make sure your room audio is connected so everyone can groove!',
    },
    sampleQuestions: [
      "In DDLJ, what does Raj's father gift him after his exams in London?",
      'Which 90s romance is set in the mustard fields of Punjab?',
      'Name the iconic on-screen couple of Kuch Kuch Hota Hai.',
    ],
    tags: ['Trending', 'Romance', 'Classics'],
    trending: true,
  },
  {
    slug: 'angry-young-man-retro',
    title: 'Angry Young Man Retro',
    blurb:
      'The seventies belonged to the rebel with a cause. Dialogs, dhamaka and the rise of the original superstar — how well do you know the angry young man era?',
    image: '/decks/deck-retro-rewind.png',
    alt: 'Man sitting in the open doorway of a moving train at golden hour',
    questionCount: 20,
    minutes: 15,
    difficulty: 'Hard',
    categories: ['Amitabh', '70s', 'Action'],
    creator: 'RetroRaja',
    host: 'RetroRaja',
    plays: '1.8K',
    preview: {
      question: 'Which 1975 blockbuster cemented the "angry young man" persona forever?',
      options: [
        { label: 'A', text: 'Zanjeer' },
        { label: 'B', text: 'Deewaar' },
        { label: 'C', text: 'Sholay' },
        { label: 'D', text: 'Trishul' },
      ],
      correctIndex: 1,
      points: 100,
    },
    sampleQuestions: [
      'Which superstar defined the angry young man era?',
      'Name the film that ran for five years in a single theatre.',
      'Which playback singer dominated this golden decade?',
    ],
    tags: ['Classics', 'Action'],
  },
]

export function getDeck(slug: string | null | undefined): Deck {
  return DECKS.find((d) => d.slug === slug) ?? DECKS[0]
}

// Static catalog used for host preview fallbacks and cover art.
// Homepage featured decks now come from getMostPlayedPublishedQuizzes.

export function difficultyClass(difficulty: Deck['difficulty']): string {
  switch (difficulty) {
    case 'Easy':
      return 'bg-success-soft text-success'
    case 'Medium':
      return 'bg-gold-soft text-gold'
    case 'Hard':
      return 'bg-brand-soft text-brand'
  }
}
