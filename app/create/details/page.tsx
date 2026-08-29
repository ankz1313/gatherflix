import type { Metadata } from 'next'
import Link from 'next/link'
import { AppTopbar } from '@/components/app-topbar'
import { CreatorStepper } from '@/components/creator/creator-stepper'

export const metadata: Metadata = {
  title: 'Deck Details · GatherFlix',
  description: 'Give your new trivia deck a name and personality.',
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const CATEGORIES = ['Classics', 'Music', 'Romance', 'Action', 'Comedy', 'Dialogs']

export default function DetailsStepPage() {
  return (
    <div className="min-h-[100dvh]">
      <AppTopbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <CreatorStepper current={1} />

        <div className="mt-10">
          <h1 className="font-display text-3xl font-black text-balance">Deck Details</h1>
          <p className="mt-2 text-muted-foreground">
            Start with the basics. You can tweak all of this later.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="deck-title" className="font-display text-sm font-bold">
              Deck title
            </label>
            <input
              id="deck-title"
              type="text"
              defaultValue="Sholay Masala Night"
              placeholder="e.g. Retro Rewind: 70s Classics"
              className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="deck-desc" className="font-display text-sm font-bold">
              Description
            </label>
            <textarea
              id="deck-desc"
              rows={3}
              defaultValue="Test your knowledge of the greatest curry-western ever made."
              placeholder="What makes this deck a must-play?"
              className="mt-2 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold"
            />
          </div>

          {/* Difficulty */}
          <div>
            <span className="font-display text-sm font-bold">Difficulty</span>
            <div className="mt-2 flex gap-2">
              {DIFFICULTIES.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  className={`flex-1 rounded-2xl border px-4 py-3 font-display text-sm font-bold transition-colors ${
                    i === 1
                      ? 'border-gold bg-gold-soft text-gold'
                      : 'border-border bg-card text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <span className="font-display text-sm font-bold">Categories</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  className={`rounded-full border px-4 py-2 font-display text-sm font-bold transition-colors ${
                    i === 0 || i === 3
                      ? 'border-brand bg-brand-soft text-brand'
                      : 'border-border bg-card text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between">
          <Link
            href="/create"
            className="rounded-full border border-border bg-secondary px-6 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </Link>
          <Link
            href="/create/questions"
            className="rounded-full bg-gold px-8 py-3 font-display text-sm font-bold text-gold-foreground shadow-[0_10px_45px_-16px] shadow-gold/70 transition-transform hover:scale-[1.02]"
          >
            Next: Questions
          </Link>
        </div>
      </main>
    </div>
  )
}
