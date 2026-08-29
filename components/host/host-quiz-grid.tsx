'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DECKS, difficultyClass, type Deck } from '@/lib/decks'

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'] as const

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

function DeckCard({ deck }: { deck: Deck }) {
  return (
    <Link
      href={`/host/preview?deck=${deck.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card/60 transition-transform hover:-translate-y-1"
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
            <span className="text-muted-foreground">{deck.questionCount} Questions</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon />
            <span className="text-muted-foreground">{deck.minutes} min</span>
          </span>
        </div>

        <h2 className="mt-3 font-display text-xl font-bold tracking-tight">{deck.title}</h2>

        <div className="mt-4 flex flex-wrap items-center gap-2">
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
      </div>
    </Link>
  )
}

export function HostQuizGrid() {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>('All')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DECKS.filter((deck) => {
      const matchesDifficulty = difficulty === 'All' || deck.difficulty === difficulty
      const matchesQuery =
        q === '' ||
        deck.title.toLowerCase().includes(q) ||
        deck.categories.some((c) => c.toLowerCase().includes(q)) ||
        deck.blurb.toLowerCase().includes(q)
      return matchesDifficulty && matchesQuery
    })
  }, [query, difficulty])

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movie, actor, director, genre or decade..."
            aria-label="Search decks"
            className="h-14 w-full rounded-2xl border border-border bg-card/60 pl-14 pr-5 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-brand"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-14 items-center gap-2 rounded-2xl border border-border bg-card/60 px-5 font-display text-sm font-bold"
            >
              Difficulty: {difficulty}
              <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
                <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {open && (
              <ul className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-2xl border border-border bg-popover p-1 shadow-xl">
                {DIFFICULTIES.map((d) => (
                  <li key={d}>
                    <button
                      type="button"
                      onClick={() => {
                        setDifficulty(d)
                        setOpen(false)
                      }}
                      className={`w-full rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-accent ${
                        d === difficulty ? 'text-brand' : 'text-foreground'
                      }`}
                    >
                      {d}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/create/details"
            className="flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-brand px-6 font-display text-sm font-bold text-brand-foreground transition-transform hover:scale-[1.02]"
          >
            <span className="text-lg leading-none">+</span> Create Deck
          </Link>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No decks match your search. Try a different genre or decade.
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((deck) => (
            <li key={deck.slug}>
              <DeckCard deck={deck} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
