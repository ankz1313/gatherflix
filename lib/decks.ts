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
    slug: 'grand-shaadi-anthems',
    title: 'Grand Shaadi Anthems',
    blurb:
      'Wedding season is a whole vibe! From sangeet floor-fillers to baraat bangers, guess the biggest big-fat-Indian-wedding anthems ever put on screen.',
    image: '/decks/deck-sangeet-superhits.png',
    alt: 'Crowd of dancers in bright lehengas celebrating under colorful stage lights',
    questionCount: 12,
    minutes: 8,
    difficulty: 'Easy',
    categories: ['Music', 'Karan Johar', 'Dance'],
    creator: 'DholBaaja',
    host: 'DholBaaja',
    plays: '3.1K',
    preview: {
      question: 'Which chartbuster is the undisputed sangeet anthem of every 2000s wedding?',
      options: [
        { label: 'A', text: 'Bole Chudiyan' },
        { label: 'B', text: 'Mehndi Laga Ke Rakhna' },
        { label: 'C', text: 'Aaj Mere Yaar Ki Shaadi Hai' },
        { label: 'D', text: 'Gallan Goodiyaan' },
      ],
      correctIndex: 0,
      points: 100,
      tip: 'Crank up the room speakers — this deck is packed with dance-along audio rounds!',
    },
    sampleQuestions: [
      'Which song is the undisputed sangeet anthem of the 2000s?',
      'Name the composer duo behind this chartbuster album.',
      'Which dance step went viral from this wedding number?',
    ],
    tags: ['Trending', 'Music'],
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
  {
    slug: 'rain-songs-monsoon-melodies',
    title: 'Rain Songs & Monsoon Melodies',
    blurb:
      'Barsaat ka mausam! Nothing says Bollywood romance like a rain-soaked duet. Guess the classic monsoon melodies and the couples who made them iconic.',
    image: '/decks/deck-monsoon-romance.png',
    alt: 'Couple under a black umbrella on a neon-lit rainy city street at night',
    questionCount: 10,
    minutes: 7,
    difficulty: 'Medium',
    categories: ['Monsoon', 'Romantic', 'Classic'],
    creator: 'BarsaatBabu',
    host: 'BarsaatBabu',
    plays: '1.2K',
    preview: {
      question: 'Which rain song features the legendary chiffon-saree-in-the-storm moment?',
      options: [
        { label: 'A', text: 'Rimjhim Gire Sawan' },
        { label: 'B', text: 'Tip Tip Barsa Paani' },
        { label: 'C', text: 'Koi Ladki Hai' },
        { label: 'D', text: 'Bheegi Bheegi Raaton Mein' },
      ],
      correctIndex: 1,
      points: 100,
    },
    sampleQuestions: [
      'Which rain song is the ultimate monsoon romance classic?',
      'Name the most iconic on-screen couple of the nineties.',
      'Which hill station backdrop features in this love saga?',
    ],
    tags: ['Romance', 'Music'],
  },
  {
    slug: 'nepo-babies-inside-jokes',
    title: 'Nepo Babies & Inside Jokes',
    blurb:
      'The tea is piping hot! From Koffee couch confessions to industry inside jokes, prove you follow Bollywood gossip better than a paparazzi.',
    image: '/decks/deck-modern-blockbusters.png',
    alt: 'Stylish couple posing in front of vertical magenta and violet light bars',
    questionCount: 15,
    minutes: 10,
    difficulty: 'Medium',
    categories: ['Koffee', 'Gossip', 'Current'],
    creator: 'KoffeeKween',
    host: 'KoffeeKween',
    plays: '4.6K',
    preview: {
      question: 'Which chat show made the "koffee hamper" a pop-culture obsession?',
      options: [
        { label: 'A', text: 'Koffee with Karan' },
        { label: 'B', text: 'The Kapil Sharma Show' },
        { label: 'C', text: 'Feet Up with the Stars' },
        { label: 'D', text: 'Famously Filmfare' },
      ],
      correctIndex: 0,
      points: 100,
    },
    sampleQuestions: [
      'Which star kid made a blockbuster debut this decade?',
      'Name the show famous for the koffee hamper.',
      'Which viral meme came from a red-carpet moment?',
    ],
    tags: ['Trending'],
    trending: true,
  },
  {
    slug: 'high-octane-action-blockbusters',
    title: 'High-Octane Action Blockbusters',
    blurb:
      'Slow-mo entries, whistle-worthy stunts and universe-building spectacles. Buckle up for the biggest big-screen action of the modern era.',
    image: '/decks/deck-high-octane-action.png',
    alt: 'Three costumed superheroes leaping through a glowing energy ring above a neon city',
    questionCount: 18,
    minutes: 12,
    difficulty: 'Hard',
    categories: ['Sci-Fi', 'Mass Action', 'VFX'],
    creator: 'VFXVeer',
    host: 'VFXVeer',
    plays: '5.3K',
    preview: {
      question: 'Which franchise kicked off Bollywood\u2019s big-budget superhero universe?',
      options: [
        { label: 'A', text: 'Krrish' },
        { label: 'B', text: 'Ra.One' },
        { label: 'C', text: 'Robot / Enthiran' },
        { label: 'D', text: 'Brahmastra' },
      ],
      correctIndex: 0,
      points: 100,
    },
    sampleQuestions: [
      'Which film set the template for the mass hero entry?',
      'Name the most ambitious VFX spectacle of the decade.',
      'Which stunt was famously done without a body double?',
    ],
    tags: ['Trending', 'Action'],
    trending: true,
  },
  {
    slug: 'wacky-comedies-memes',
    title: 'Wacky Comedies & Memes',
    blurb:
      'Utha le re baba! From Hera Pheri chaos to meme-worthy one-liners, this is the ultimate test of your Bollywood comedy timing.',
    image: '/decks/deck-wacky-comedies.png',
    alt: 'Three men scrambling over a sack of cash in a chaotic Bollywood comedy banner',
    questionCount: 18,
    minutes: 12,
    difficulty: 'Easy',
    categories: ['Hera Pheri', 'Comedy', 'Priyan'],
    creator: 'MemeRaja',
    host: 'MemeRaja',
    plays: '6.9K',
    preview: {
      question: 'In Hera Pheri, what is the name of the garage owner\u2019s iconic landline saga about?',
      options: [
        { label: 'A', text: 'A wrong-number ransom call' },
        { label: 'B', text: 'A lottery ticket win' },
        { label: 'C', text: 'A rent dispute' },
        { label: 'D', text: 'A cricket bet' },
      ],
      correctIndex: 0,
      points: 100,
    },
    sampleQuestions: [
      'Which comedy gave us the "25 din mein paisa double" scheme?',
      'Name the trio at the heart of Hera Pheri.',
      'Which one-liner became an all-time meme template?',
    ],
    tags: ['Trending', 'Comedy'],
    trending: true,
    featured: true,
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
