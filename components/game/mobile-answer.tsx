'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SAMPLE_QUESTION, GAME_META } from '@/lib/game'

const OPTIONS = [
  { letter: 'A', color: 'var(--gold)' },
  { letter: 'B', color: 'var(--brand)' },
  { letter: 'C', color: 'var(--success)' },
  { letter: 'D', color: '#f2622e' },
]

// The color code that matches the correct answer shown on the TV screen.
const CORRECT_LETTER = OPTIONS[SAMPLE_QUESTION.correctIndex].letter

export function MobileAnswer() {
  const router = useRouter()
  const [remaining, setRemaining] = useState(GAME_META.timerSeconds)
  const [locked, setLocked] = useState<string | null>(null)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])

  function pick(letter: string) {
    if (locked) return
    setLocked(letter)
    setTimeout(() => {
      router.push(`/play/mobile/result?correct=${letter === CORRECT_LETTER ? '1' : '0'}`)
    }, 900)
  }

  const pct = Math.max(0, (remaining / GAME_META.timerSeconds) * 100)

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pb-10 pt-8">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <span className="font-display text-lg font-black tracking-tight text-brand">
          ROUND {GAME_META.round} OF {GAME_META.totalQuestions}
        </span>
        <span className="font-display text-lg font-black tracking-tight text-gold">
          {SAMPLE_QUESTION.points} PTS MAX
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <span className="text-muted-foreground">Time Remaining</span>
        <span className="text-brand">{remaining}s</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Prompt card */}
      <div className="mt-6 rounded-3xl border border-border bg-card/60 px-6 py-5 text-center">
        <h1 className="font-display text-2xl font-black tracking-tight text-balance">
          Read the TV Screen
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap the correct color code to lock in!</p>
      </div>

      {/* Answer tiles */}
      <div className="mt-6 flex flex-col gap-4">
        {OPTIONS.map((o) => {
          const isLocked = locked === o.letter
          return (
            <button
              key={o.letter}
              type="button"
              onClick={() => pick(o.letter)}
              disabled={!!locked}
              aria-label={`Option ${o.letter}`}
              className="flex h-[4.5rem] items-center rounded-3xl border-2 px-6 text-left font-display text-2xl font-black transition-all active:scale-[0.99] disabled:cursor-default"
              style={
                isLocked
                  ? { backgroundColor: o.color, borderColor: o.color, color: '#fff' }
                  : {
                      borderColor: o.color,
                      color: o.color,
                      background: `linear-gradient(90deg, color-mix(in oklab, ${o.color} 16%, transparent), transparent)`,
                    }
              }
            >
              {isLocked ? `${o.letter} [ LOCKED IN ]` : o.letter}
            </button>
          )
        })}
      </div>

      <div className="mx-auto mt-8 h-1.5 w-32 rounded-full bg-muted-foreground/30" />
    </div>
  )
}
