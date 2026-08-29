'use client'

import Link from 'next/link'
import { AvatarBadge } from '@/components/join/avatar-badge'
import { FINAL_RESULTS, GAME_SUMMARY } from '@/lib/game'

// The player is shown as 2nd place for this demo standing.
const ME_INDEX = 1

export function MobileFinal() {
  const me = FINAL_RESULTS[ME_INDEX]
  const place = ME_INDEX + 1
  const suffix = place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th'
  const isTop3 = place <= 3

  return (
    <main className="flex min-h-[100dvh] flex-col items-center px-6 py-10 text-center">
      <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-brand">
        Game Over
      </p>

      {/* Big placement */}
      <div className="mt-8 flex flex-col items-center">
        <div className="relative">
          <AvatarBadge name={me.name} styleId={me.styleId} size={112} />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 font-display text-sm font-black text-gold-foreground shadow-lg">
            {place}
            {suffix}
          </span>
        </div>
        <h1 className="mt-8 font-display text-3xl font-black text-balance">
          {isTop3 ? `You made the podium, ${me.name}!` : `Great game, ${me.name}!`}
        </h1>
        <p className="mt-2 text-muted-foreground">
          You finished {place}
          {suffix} of {GAME_SUMMARY.playerCount}
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid w-full max-w-xs grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-display text-2xl font-black text-gold">
            {me.score.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">Total points</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-display text-2xl font-black">
            {me.correct}
            <span className="text-base text-muted-foreground">/{GAME_SUMMARY.totalQuestions}</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">Correct</p>
        </div>
      </div>

      <div className="mt-auto w-full max-w-xs pt-10">
        <Link
          href="/library"
          className="flex w-full items-center justify-center rounded-full bg-gold px-8 py-4 font-display text-base font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70"
        >
          Find Another Game
        </Link>
        <Link
          href="/"
          className="mt-3 block text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
