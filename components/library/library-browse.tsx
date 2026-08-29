'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DECKS, difficultyClass, type Deck } from '@/lib/decks'
import { GatherflixLogo } from '@/components/gatherflix-logo'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
const DECADES = ['90s', '2000s', '2010s', '2020s'] as const
const TYPES = ['Songs', 'Dialogues', 'Actors', 'Directors'] as const

function QuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 text-muted-foreground" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.5 9.2a2.5 2.5 0 0 1 4.6 1.3c0 1.7-2.1 2-2.1 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 text-muted-foreground" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function TagRow({ deck }: { deck: Deck }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`rounded-md px-2.5 py-1 font-display text-[0.7rem] font-bold uppercase tracking-wide ${difficultyClass(
          deck.difficulty,
        )}`}
      >
        {deck.difficulty}
      </span>
      {deck.categories.map((cat) => (
        <span
          key={cat}
          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground"
        >
          {cat}
        </span>
      ))}
    </div>
  )
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border px-4 py-2 font-display text-sm font-bold transition-colors ${
        active
          ? 'border-brand text-brand'
          : 'border-border bg-card/40 text-foreground hover:border-muted-foreground'
      }`}
    >
      {children}
    </button>
  )
}

export function LibraryBrowse() {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number] | null>('Medium')
  const [decade, setDecade] = useState<(typeof DECADES)[number] | null>('90s')
  const [type, setType] = useState<(typeof TYPES)[number] | null>('Dialogues')
  const [visible, setVisible] = useState(6)

  const featured = DECKS.find((d) => d.featured) ?? DECKS[0]

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DECKS.filter((deck) => {
      if (deck.slug === featured.slug) return false
      const matchesDifficulty = !difficulty || deck.difficulty === difficulty
      const matchesQuery =
        !q ||
        deck.title.toLowerCase().includes(q) ||
        deck.blurb.toLowerCase().includes(q) ||
        deck.categories.some((c) => c.toLowerCase().includes(q))
      // Decade/type are presentational refinements; keep results if either matches loosely
      return matchesQuery && (matchesDifficulty || !!q)
    })
  }, [query, difficulty, featured.slug])

  return (
    <>
      {/* Top nav */}
      <header className="border-b border-border/60">
        <div className="container-page flex items-center justify-between gap-6 py-5">
          <div className="flex items-center gap-8">
            <GatherflixLogo />
            <nav className="hidden items-center gap-7 md:flex">
              <Link
                href="/library"
                className="font-display text-sm font-bold text-gold"
              >
                Explore Packs
              </Link>
              <Link
                href="/host/room"
                className="font-display text-sm font-bold text-muted-foreground hover:text-foreground"
              >
                My Rooms
              </Link>
              <Link
                href="/results"
                className="font-display text-sm font-bold text-muted-foreground hover:text-foreground"
              >
                Leaderboard
              </Link>
            </nav>
          </div>

          <div className="relative w-full max-w-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Bollywood trivia..."
              aria-label="Search decks"
              className="h-11 w-full rounded-xl border border-border bg-card/60 pl-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </header>

      <section className="container-page py-8">
        {/* Filter panel */}
        <div className="rounded-3xl border border-border bg-card/40 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-brand px-4 py-2 font-display text-sm font-bold text-brand"
            >
              <span aria-hidden="true">{'\u{1F3AC}'}</span> Bollywood Cinema
              <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <Pill
                  key={d}
                  active={difficulty === d}
                  onClick={() => setDifficulty(difficulty === d ? null : d)}
                >
                  {d}
                </Pill>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Decade:
            </span>
            {DECADES.map((d) => (
              <Pill key={d} active={decade === d} onClick={() => setDecade(decade === d ? null : d)}>
                {d}
              </Pill>
            ))}
            <span className="ml-4 mr-1 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Type:
            </span>
            {TYPES.map((t) => (
              <Pill key={t} active={type === t} onClick={() => setType(type === t ? null : t)}>
                {t}
              </Pill>
            ))}
          </div>
        </div>

        <h1 className="mt-10 font-display text-3xl font-extrabold tracking-[-0.01em]">
          Featured Quiz Packs
        </h1>

        {/* Featured wide banner */}
        <Link
          href={`/host/preview?deck=${featured.slug}`}
          className="group mt-5 block overflow-hidden rounded-3xl border border-border bg-card/60 transition-transform hover:-translate-y-1"
        >
          <div className="relative aspect-[21/7]">
            <Image
              src={featured.image}
              alt={featured.alt}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <div className="flex items-center gap-2 text-sm">
                <QuestionIcon />
                <span className="text-muted-foreground">{featured.questionCount} Qs</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold">{featured.title}</h2>
              <div className="mt-3">
                <TagRow deck={featured} />
              </div>
            </div>
            <div className="flex items-center gap-2 self-start text-sm">
              <ClockIcon />
              <span className="text-muted-foreground">{featured.minutes} min</span>
            </div>
          </div>
        </Link>

        {/* Grid of remaining packs */}
        {results.length > 0 && (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visible).map((deck) => (
              <li key={deck.slug}>
                <Link
                  href={`/host/preview?deck=${deck.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/60 transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={deck.image}
                      alt={deck.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <QuestionIcon />
                        <span className="text-muted-foreground">{deck.questionCount} Qs</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ClockIcon />
                        <span className="text-muted-foreground">{deck.minutes} min</span>
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold tracking-tight">
                      {deck.title}
                    </h3>
                    <div className="mt-4">
                      <TagRow deck={deck} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex justify-center">
          {visible < results.length ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-full border border-border bg-card px-8 py-3.5 font-display text-sm font-bold transition-colors hover:bg-accent"
            >
              Load More Quiz Packs
            </button>
          ) : (
            results.length === 0 && (
              <p className="text-muted-foreground">
                No packs match these filters. Try clearing a filter.
              </p>
            )
          )}
        </div>
      </section>
    </>
  )
}
