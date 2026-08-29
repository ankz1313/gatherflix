export type DeckTag = 'Trending' | 'Classics' | 'Music' | 'Romance' | 'Action' | 'Comedy'

export type Deck = {
  slug: string
  title: string
  blurb: string
  image: string
  alt: string
  questionCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  categories: string[]
  host: string
  plays: string
  sampleQuestions: string[]
  tags: DeckTag[]
  trending?: boolean
}

export const DECKS: Deck[] = [
  {
    slug: 'sholay-masala-night',
    title: 'Sholay Masala Night',
    blurb: 'Legendary dialogs, iconic villains and the ultimate curry western showdown.',
    image: '/decks/hero-sholay-masala-night.png',
    alt: 'Bollywood dancers on an ornate theatre stage under spotlights',
    questionCount: 50,
    difficulty: 'Medium',
    categories: ['Dialogs', 'Characters', 'Music', 'Trivia'],
    host: 'Rahul Khanna',
    plays: '12.4k plays',
    sampleQuestions: [
      'Kitne aadmi the? Who asks this legendary question?',
      'Which year did this cult classic first release?',
      'Name the coin that decides every big call in the film.',
    ],
    tags: ['Trending', 'Classics', 'Action'],
    trending: true,
  },
  {
    slug: 'sangeet-superhits',
    title: 'Sangeet Superhits',
    blurb: 'Wedding season bangers and dance floor classics.',
    image: '/decks/deck-sangeet-superhits.png',
    alt: 'Crowd of dancers in bright lehengas celebrating under colorful stage lights',
    questionCount: 40,
    difficulty: 'Easy',
    categories: ['Music', 'Dance', 'Weddings'],
    host: 'Priya Menon',
    plays: '9.1k plays',
    sampleQuestions: [
      'Which song is the undisputed sangeet anthem of the 2000s?',
      'Name the composer duo behind this chartbuster album.',
      'Which dance step went viral from this wedding number?',
    ],
    tags: ['Trending', 'Music'],
    trending: true,
  },
  {
    slug: 'retro-rewind',
    title: 'Retro Rewind',
    blurb: 'Seventies and eighties cult classics, dialogs included.',
    image: '/decks/deck-retro-rewind.png',
    alt: 'Man sitting in the open doorway of a moving train at golden hour',
    questionCount: 35,
    difficulty: 'Medium',
    categories: ['Dialogs', 'Classics', 'Trivia'],
    host: 'Vikram Rao',
    plays: '7.8k plays',
    sampleQuestions: [
      'Which superstar defined the angry young man era?',
      'Name the film that ran for five years in a single theatre.',
      'Which playback singer dominated this golden decade?',
    ],
    tags: ['Classics', 'Music'],
  },
  {
    slug: 'monsoon-romance',
    title: 'Monsoon Romance',
    blurb: 'Rain songs, love triangles and iconic on-screen pairs.',
    image: '/decks/deck-monsoon-romance.png',
    alt: 'Couple under a black umbrella on a neon-lit rainy city street at night',
    questionCount: 30,
    difficulty: 'Easy',
    categories: ['Romance', 'Music', 'Pairs'],
    host: 'Ananya Desai',
    plays: '6.2k plays',
    sampleQuestions: [
      'Which rain song is the ultimate monsoon romance classic?',
      'Name the most iconic on-screen couple of the nineties.',
      'Which hill station backdrop features in this love saga?',
    ],
    tags: ['Romance', 'Music'],
  },
  {
    slug: 'modern-blockbusters',
    title: 'Modern Blockbusters',
    blurb: 'Post-2010 hits, chartbusters and box office records.',
    image: '/decks/deck-modern-blockbusters.png',
    alt: 'Stylish couple posing in front of vertical magenta and violet light bars',
    questionCount: 45,
    difficulty: 'Hard',
    categories: ['Box Office', 'Music', 'Trivia', 'Stars'],
    host: 'Karan Malhotra',
    plays: '14.9k plays',
    sampleQuestions: [
      'Which film was the first to cross the 1000 crore mark worldwide?',
      'Name the highest streamed Bollywood track of the decade.',
      'Which sequel broke its own franchise opening record?',
    ],
    tags: ['Trending', 'Action'],
    trending: true,
  },
  {
    slug: 'comedy-capers',
    title: 'Comedy Capers',
    blurb: 'Slapstick gold, one-liners and the funniest sidekicks ever.',
    image: '/decks/deck-comedy-capers.png',
    alt: 'Group of friends laughing on a sunny Mumbai rooftop',
    questionCount: 38,
    difficulty: 'Easy',
    categories: ['Comedy', 'Dialogs', 'Characters'],
    host: 'Nikhil Shah',
    plays: '8.5k plays',
    sampleQuestions: [
      'Which comic duo defined the buddy comedy genre?',
      'Name the film with the most quoted one-liners.',
      'Which sidekick became bigger than the hero?',
    ],
    tags: ['Comedy'],
  },
  {
    slug: 'action-masala',
    title: 'Action Masala',
    blurb: 'Explosions, slow-mo entries and the loudest hero whistles.',
    image: '/decks/deck-action-masala.png',
    alt: 'Action hero amid explosions on a nighttime dockyard',
    questionCount: 42,
    difficulty: 'Hard',
    categories: ['Action', 'Stunts', 'Trivia'],
    host: 'Sameer Joshi',
    plays: '11.2k plays',
    sampleQuestions: [
      'Which film set the template for the mass hero entry?',
      'Name the most iconic action director of the decade.',
      'Which stunt was famously done without a body double?',
    ],
    tags: ['Trending', 'Action'],
    trending: true,
  },
  {
    slug: 'iconic-villains',
    title: 'Iconic Villains',
    blurb: 'Menacing masterminds, evil laughs and unforgettable monologues.',
    image: '/decks/deck-iconic-villains.png',
    alt: 'Menacing antagonist seated on a throne in a smoky lair',
    questionCount: 33,
    difficulty: 'Medium',
    categories: ['Characters', 'Dialogs', 'Classics'],
    host: 'Farah Ali',
    plays: '5.9k plays',
    sampleQuestions: [
      'Which villain\u2019s laugh became a cultural catchphrase?',
      'Name the antagonist with the longest screen monologue.',
      'Which baddie later played a beloved hero?',
    ],
    tags: ['Classics'],
  },
  {
    slug: 'desh-bhakti',
    title: 'Desh Bhakti Special',
    blurb: 'Patriotic anthems, war epics and goosebump-worthy speeches.',
    image: '/decks/deck-desh-bhakti.png',
    alt: 'Young people waving a tricolor flag against a golden sunrise',
    questionCount: 36,
    difficulty: 'Medium',
    categories: ['Trivia', 'Music', 'Classics'],
    host: 'Aditya Verma',
    plays: '7.1k plays',
    sampleQuestions: [
      'Which patriotic anthem tops every Independence Day playlist?',
      'Name the war epic based on a real 1971 operation.',
      'Which speech scene is quoted every August 15?',
    ],
    tags: ['Music', 'Classics'],
  },
]

export function getDeck(slug: string | null | undefined): Deck {
  return DECKS.find((d) => d.slug === slug) ?? DECKS[0]
}

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
