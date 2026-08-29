import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CreatorNav } from '@/components/creator/creator-nav'
import { MY_DECKS, CREATOR_COUNTS } from '@/lib/creator'

export const metadata: Metadata = {
  title: 'My Quizzes · GatherFlix',
  description: 'Create, review, and manage your custom Bollywood movie-night quizzes.',
}

const TABS = [
  { label: `All Quizzes (${CREATOR_COUNTS.all})`, active: true },
  { label: `Drafts (${CREATOR_COUNTS.drafts})`, active: false },
  { label: `Published (${CREATOR_COUNTS.published})`, active: false },
]

export default function CreatorDashboardPage() {
  return (
    <div className="min-h-[100dvh]">
      <CreatorNav active="My Quizzes" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Heading */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-display text-5xl font-black tracking-tight text-balance">
              My Cinematic Quizzes
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
              Create, review, and manage your custom Bollywood movie nights. Make your lobby wait
              for the ultimate showdown.
            </p>
          </div>
          <Link
            href="/create/details"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gold px-7 py-3.5 font-display text-[0.95rem] font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02]"
          >
            + Create New Quiz
          </Link>
        </div>

        {/* Tabs + search */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={`rounded-full px-5 py-2.5 font-display text-sm font-bold transition-colors ${
                  tab.active
                    ? 'border-2 border-brand text-brand'
                    : 'border border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Search my quizzes</span>
            <span className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-muted-foreground" />
            <input
              type="search"
              placeholder="Search my drafts..."
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
            />
          </label>
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {MY_DECKS.map((deck) => (
            <div
              key={deck.title}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="relative aspect-[16/9] w-full">
                <Image src={deck.image} alt={deck.alt} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span
                      className="inline-block size-3.5 rounded-full border-2 border-muted-foreground"
                      aria-hidden="true"
                    />
                    {deck.questions} Qs
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-1 font-display text-xs font-bold uppercase ${
                      deck.status === 'Published'
                        ? 'border border-success/50 text-success'
                        : 'border border-gold/50 text-gold'
                    }`}
                  >
                    {deck.status}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-black">{deck.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Last edited: {deck.updated}</p>
                <hr className="my-4 border-border" />
                <div className="flex items-center justify-between font-display text-sm font-bold">
                  <Link
                    href="/create/questions"
                    className={deck.status === 'Published' ? 'text-gold' : 'text-brand'}
                  >
                    {deck.status === 'Published' ? 'Edit Quiz' : 'Resume Editing'}
                  </Link>
                  <div className="flex items-center gap-4">
                    <button type="button" className="text-muted-foreground hover:text-foreground">
                      Duplicate
                    </button>
                    <button type="button" className="text-brand hover:opacity-80">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty / info card */}
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border p-8 text-center">
            <span className="grid size-14 place-items-center rounded-full border-2 border-brand text-2xl text-brand">
              {'\u2726'}
            </span>
            <h3 className="mt-5 font-display text-xl font-black">New to the Director&apos;s Chair?</h3>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Put your Bollywood film knowledge to work! Create your own trivia games to host with
              friends or publish them publicly.
            </p>
            <Link
              href="/create/details"
              className="mt-4 font-display text-sm font-bold text-gold underline underline-offset-4"
            >
              Check out our Hosting Guide
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
