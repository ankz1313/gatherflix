'use client'

import Link from 'next/link'
import { useState } from 'react'

const CATEGORIES = [
  { label: '\u{1F3AC} Bollywood Cinema', enabled: true },
  { label: '\u{1F4FA} Series (Soon)', enabled: false },
  { label: '\u{1F3AC} Hollywood (Soon)', enabled: false },
]

const DECADES = ['90s', '2000s', '2010s', '2020s']
const TYPES = ['Songs', 'Dialogues', 'Actors', 'Directors']

const DIFFICULTIES = [
  { label: 'Easy (Freshman)', dot: 'var(--success)' },
  { label: 'Medium (Box Office)', dot: 'var(--gold)' },
  { label: 'Hard (Director Cut)', dot: 'var(--brand)' },
]

export function QuizDetailsForm() {
  const [category, setCategory] = useState(0)
  const [decade, setDecade] = useState('90s')
  const [types, setTypes] = useState<string[]>(['Songs', 'Dialogues'])
  const [difficulty, setDifficulty] = useState(1)

  function toggleType(t: string) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[300px_1fr]">
      {/* Left rail */}
      <aside>
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-black uppercase tracking-wide text-brand">
            Step 1 of 3
          </span>
          <span className="font-display text-sm font-bold">Quiz Settings</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/3 rounded-full bg-brand" />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="font-display text-lg font-black text-gold">Lights, Camera, Action!</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every blockbuster quiz starts with high production value. Enter a catchy title, select
            tags that specify which Bollywood era you&apos;re covering, and choose a color-coded
            difficulty.
          </p>
          <p className="mt-4 text-sm font-semibold text-brand">
            Tip: Mixed actors and dialogue questions keep the pacing exciting!
          </p>
        </div>
      </aside>

      {/* Right card */}
      <div className="rounded-[2rem] border border-border bg-card/50 p-7 sm:p-10">
        <h1 className="font-display text-3xl font-black tracking-tight">Quiz Overview Details</h1>

        <div className="mt-8 space-y-7">
          {/* Title */}
          <div>
            <label htmlFor="q-title" className="font-display text-sm font-bold">
              Quiz Title
            </label>
            <input
              id="q-title"
              type="text"
              placeholder="e.g. Ultimate Shah Rukh Khan Mega Fan Quiz"
              className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3.5 outline-none placeholder:text-muted-foreground/70 focus:border-brand"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="q-desc" className="font-display text-sm font-bold">
              Description
            </label>
            <textarea
              id="q-desc"
              rows={3}
              placeholder="Write a short description to hook your players. What cinematic surprises do you have in store?"
              className="mt-2 w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3.5 outline-none placeholder:text-muted-foreground/70 focus:border-brand"
            />
          </div>

          {/* Primary category */}
          <div>
            <span className="font-display text-sm font-bold">Primary Category</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  disabled={!c.enabled}
                  onClick={() => c.enabled && setCategory(i)}
                  className={`rounded-xl border px-5 py-3 font-display text-sm font-bold transition-colors ${
                    category === i && c.enabled
                      ? 'border-brand bg-brand-soft text-brand'
                      : c.enabled
                        ? 'border-border bg-background/60 text-foreground hover:bg-accent'
                        : 'cursor-not-allowed border-border bg-background/30 text-muted-foreground/50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-tags & decades */}
          <div>
            <span className="font-display text-sm font-bold">Sub-Tags &amp; Decades (Multi-select)</span>
            <div className="mt-2 space-y-4 rounded-xl border border-border bg-background/40 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-20 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Decade:
                </span>
                {DECADES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDecade(d)}
                    className={`rounded-full border px-4 py-1.5 font-display text-sm font-bold transition-colors ${
                      decade === d
                        ? 'border-brand bg-brand-soft text-brand'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-20 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Type:
                </span>
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleType(t)}
                    className={`rounded-full border px-4 py-1.5 font-display text-sm font-bold transition-colors ${
                      types.includes(t)
                        ? 'border-brand bg-brand-soft text-brand'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <span className="font-display text-sm font-bold">Quiz Difficulty</span>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {DIFFICULTIES.map((d, i) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => setDifficulty(i)}
                  className={`flex items-center gap-2.5 rounded-xl border px-5 py-3.5 font-display text-sm font-bold transition-colors ${
                    difficulty === i
                      ? 'border-gold bg-gold-soft text-foreground'
                      : 'border-border bg-background/60 text-foreground hover:bg-accent'
                  }`}
                >
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: d.dot }} />
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/create"
            className="font-display text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            Cancel Quiz Creation
          </Link>
          <Link
            href="/create/questions"
            className="rounded-full bg-gold px-8 py-3.5 font-display text-sm font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02]"
          >
            Next: Add Questions
          </Link>
        </div>
      </div>
    </main>
  )
}
