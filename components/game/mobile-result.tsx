'use client'

import Link from 'next/link'
import { MOBILE_RESULT } from '@/lib/game'

export function MobileResult({ correct }: { correct: boolean }) {
  const r = correct ? MOBILE_RESULT.correct : MOBILE_RESULT.wrong
  const accent = correct ? 'var(--success)' : 'var(--brand)'

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <div className="w-full rounded-[2rem] border border-border bg-card/70 px-7 py-9 text-center">
        {/* Icon pill */}
        <div
          className="mx-auto grid h-14 w-28 place-items-center rounded-full border-2"
          style={{ borderColor: accent, backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)` }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-7" style={{ color: accent }}>
            {correct ? (
              <path
                d="m5 12 4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>

        {/* Headline */}
        <h1
          className="mt-6 font-display text-5xl font-black tracking-tight"
          style={{ color: accent }}
        >
          {correct ? 'CORRECT!' : 'MISSED IT!'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You chose: {MOBILE_RESULT.chosenLetter}. {MOBILE_RESULT.chosenText}
        </p>

        <hr className="my-7 border-border" />

        {/* Points */}
        <p className="font-display text-6xl font-black tracking-tight text-gold">
          {r.points >= 0 ? '+' : ''}
          {r.points} PTS
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="rounded-full bg-success-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-success">
            Base: {r.base}
          </span>
          <span className="rounded-full bg-gold-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-gold">
            Speed Multiplier: {r.multiplier}
          </span>
        </div>

        <hr className="my-7 border-border" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current Rank
            </p>
            <p className="mt-1 font-display text-2xl font-black">#{r.rank}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total Score
            </p>
            <p className="mt-1 font-display text-2xl font-black">
              {r.totalScore.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Behind Next
            </p>
            <p className="mt-1 font-display text-2xl font-black text-brand">{r.behindNext}</p>
          </div>
        </div>
      </div>

      <Link
        href="/results/mobile"
        className="mt-6 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        Skip to final results
      </Link>
    </div>
  )
}
