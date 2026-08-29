'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { DECKS, difficultyClass, type DeckTag } from '@/lib/decks'

const FILTERS: (DeckTag | 'All')[] = [
  'All',
  'Trending',
  'Classics',
  'Music',
  'Romance',
  'Action',
  'Comedy',
]

export function LibraryBrowse() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<(DeckTag | 'All')>('All')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DECKS.filter((deck) => {
      const matchesTag = active === 'All' || deck.tags.includes(active)
      const matchesQuery =
        !q ||
        deck.title.toLowerCase().includes(q) ||
        deck.blurb.toLowerCase().includes(q) ||
        deck.categories.some((c) => c.toLowerCase().includes(q))
      return matchesTag && matchesQuery
    })
  }, [query, active])

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand">
          Trending Packs
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-5xl">
          Browse the deck library
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Hundreds of fan-made Bollywood trivia decks. Find your vibe, then host or join a game.
        </p>
      </div>

      {/* Search */}
      <div className="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-border bg-card px-5 py-3.5">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decks, songs, eras…"
          aria-label="Search decks"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Filter chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActive(filter)}
            aria-pressed={active === filter}
            className={[
              'rounded-full px-4 py-2 font-display text-sm font-bold transition-colors',
              active === filter
                ? 'bg-foreground text-background'
                : 'border border-border bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground',
            ].join(' ')}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="mt-8 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? 'deck' : 'decks'}
        {active !== 'All' ? ` in ${active}` : ''}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border p-14 text-center">
          <p className="font-display text-lg font-bold">No decks found</p>
          <p className="mt-2 text-muted-foreground">Try a different search or category.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((deck) => (
            <li key={deck.slug}>
              <Link
                href={`/host/preview?deck=${deck.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_-32px_rgb(0_0_0/0.5)] transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={deck.image}
                    alt={deck.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {deck.trending && (
                    <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 font-display text-xs font-bold text-gold-foreground shadow-md">
                      Trending
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 font-display text-xs font-bold ${difficultyClass(deck.difficulty)}`}>
                      {deck.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">{deck.questionCount} questions</span>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-bold tracking-tight">{deck.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{deck.blurb}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{deck.plays}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
