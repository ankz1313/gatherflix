'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import { DECKS, difficultyClass } from '@/lib/decks'
import type { QuizSummary } from '@/lib/quiz-data'
import { QUIZ_CATEGORIES, quizMatchesCategory, resolveQuizCategory, type QuizCategory } from '@/lib/categories'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { UserMenu } from '@/components/auth/user-menu'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const

const FALLBACK_IMAGE = '/decks/deck-classic-90s-romance.png'

function coverFor(quiz: QuizSummary): string {
  if (quiz.coverImageUrl?.trim()) return quiz.coverImageUrl
  return DECKS.find((d) => d.title === quiz.title)?.image ?? FALLBACK_IMAGE
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to load quizzes')
    return r.json() as Promise<{ quizzes: QuizSummary[] }>
  })

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

function quizTags(quiz: QuizSummary): string[] {
  const canonical = resolveQuizCategory(quiz).label
  const extras = [quiz.category, ...quiz.subtags].filter(Boolean) as string[]
  const skip = new Set([canonical.toLowerCase(), 'bollywood cinema'])
  const rest = extras.filter((t) => !skip.has(t.toLowerCase()))
  return Array.from(new Set([canonical, ...rest])).slice(0, 3)
}

function TagRow({ quiz }: { quiz: QuizSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`rounded-md px-2.5 py-1 font-display text-[0.7rem] font-bold uppercase tracking-wide ${difficultyClass(
          quiz.difficulty,
        )}`}
      >
        {quiz.difficulty}
      </span>
      {quizTags(quiz).map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground"
        >
          {tag}
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
      className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 font-display text-sm font-bold transition-colors ${
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
  const { data, error, isLoading } = useSWR('/api/quizzes', fetcher)
  const quizzes = data?.quizzes ?? []

  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number] | null>(null)
  const [category, setCategory] = useState<QuizCategory | null>(null)
  const [visible, setVisible] = useState(6)

  useEffect(() => {
    setVisible(6)
  }, [category, difficulty, query])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return quizzes.filter((quiz) => {
      const matchesCategory = quizMatchesCategory(quiz, category)
      const matchesDifficulty = !difficulty || quiz.difficulty === difficulty
      const matchesQuery =
        !q ||
        quiz.title.toLowerCase().includes(q) ||
        (quiz.description ?? '').toLowerCase().includes(q) ||
        quizTags(quiz).some((c) => c.toLowerCase().includes(q))
      return matchesCategory && matchesQuery && (matchesDifficulty || !!q)
    })
  }, [quizzes, query, difficulty, category])

  // API returns packs ordered by host count, so the first match is the featured hero.
  const featured = filtered[0] ?? null
  const results = featured ? filtered.slice(1) : filtered

  return (
    <>
      {/* Top nav */}
      <header className="border-b border-border/60">
        <div className="container-page flex items-center justify-between gap-6 py-5">
          <div className="flex items-center gap-8">
            <GatherflixLogo />
            <nav className="hidden items-center gap-7 md:flex">
              <Link href="/library" className="font-display text-sm font-bold text-gold">
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

          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search trivia packs..."
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
            <div className="hidden shrink-0 md:block">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <section className="container-page py-8">
        {/* Filter panel */}
        <div className="rounded-3xl border border-border bg-card/40 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Category:
            </span>
            <Pill active={category === null} onClick={() => setCategory(null)}>
              All
            </Pill>
            {QUIZ_CATEGORIES.map((c) => (
              <Pill
                key={c.value}
                active={category?.value === c.value}
                onClick={() => setCategory(category?.value === c.value ? null : c)}
              >
                <span aria-hidden="true">{c.emoji}</span> {c.label}
              </Pill>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Difficulty:
            </span>
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

        <h1 className="mt-10 font-display text-3xl font-extrabold tracking-[-0.01em]">
          Featured Quiz Packs
        </h1>

        {/* Loading / error / empty states */}
        {isLoading && (
          <p className="mt-6 text-muted-foreground">Loading quiz packs…</p>
        )}
        {error && !isLoading && (
          <p className="mt-6 text-muted-foreground">
            Could not load quiz packs. Please refresh to try again.
          </p>
        )}
        {!isLoading && !error && filtered.length === 0 && quizzes.length > 0 && (
          <p className="mt-6 text-muted-foreground">
            No packs match these filters. Try clearing a filter.
          </p>
        )}
        {!isLoading && !error && quizzes.length === 0 && (
          <p className="mt-6 text-muted-foreground">No published quiz packs yet.</p>
        )}

        {/* Featured wide banner */}
        {featured && (
          <Link
            href={`/host/preview?quiz=${featured.id}`}
            className="group mt-5 block overflow-hidden rounded-3xl border border-border bg-card/60 transition-transform hover:-translate-y-1"
          >
            <div className="relative aspect-[21/7]">
              <Image
                src={coverFor(featured)}
                alt={featured.title}
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
                  <TagRow quiz={featured} />
                </div>
              </div>
              <div className="flex items-center gap-2 self-start text-sm">
                <ClockIcon />
                <span className="text-muted-foreground">{featured.minutes} min</span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid of remaining packs */}
        {results.length > 0 && (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, visible).map((quiz) => (
              <li key={quiz.id}>
                <Link
                  href={`/host/preview?quiz=${quiz.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/60 transition-transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={coverFor(quiz)}
                      alt={quiz.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <QuestionIcon />
                        <span className="text-muted-foreground">{quiz.questionCount} Qs</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ClockIcon />
                        <span className="text-muted-foreground">{quiz.minutes} min</span>
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold tracking-tight">
                      {quiz.title}
                    </h3>
                    <div className="mt-4">
                      <TagRow quiz={quiz} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex justify-center">
          {visible < results.length && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + 6)}
              className="rounded-full border border-border bg-card px-8 py-3.5 font-display text-sm font-bold transition-colors hover:bg-accent"
            >
              Load More Quiz Packs
            </button>
          )}
        </div>
      </section>
    </>
  )
}
