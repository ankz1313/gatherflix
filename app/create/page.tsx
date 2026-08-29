import type { Metadata } from 'next'
import Link from 'next/link'
import { AppTopbar } from '@/components/app-topbar'
import { MY_DECKS, CREATOR_STATS } from '@/lib/creator'

export const metadata: Metadata = {
  title: 'Creator Dashboard · GatherFlix',
  description: 'Build and manage your own Bollywood trivia decks.',
}

export default function CreatorDashboardPage() {
  return (
    <div className="min-h-[100dvh]">
      <AppTopbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-black text-balance">Your Studio</h1>
            <p className="mt-2 text-muted-foreground">
              Craft masala-packed decks and share them with the community.
            </p>
          </div>
          <Link
            href="/create/details"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-display text-[0.95rem] font-bold text-gold-foreground shadow-[0_10px_45px_-14px] shadow-gold/70 transition-transform hover:scale-[1.02]"
          >
            <span className="text-lg leading-none">+</span> Create New Deck
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          {CREATOR_STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-3xl font-black text-gold">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Deck list */}
        <h2 className="mt-12 font-display text-xl font-extrabold">Your Decks</h2>
        <div className="mt-4 space-y-3">
          {MY_DECKS.map((deck) => (
            <div
              key={deck.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 font-display text-xs font-bold ${
                    deck.status === 'Published'
                      ? 'bg-success-soft text-success'
                      : 'bg-gold-soft text-gold'
                  }`}
                >
                  {deck.status}
                </span>
                <div>
                  <p className="font-display text-lg font-bold">{deck.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {deck.questions} questions · Updated {deck.updated}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm text-muted-foreground">{deck.plays} plays</span>
                <Link
                  href="/create/questions"
                  className="rounded-full border border-border bg-secondary px-5 py-2 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
