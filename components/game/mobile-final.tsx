'use client'

import Link from 'next/link'
import { FINAL_RESULTS, GAME_SUMMARY } from '@/lib/game'

// The player is shown as 3rd place (Simran) for this demo standing.
const ME_INDEX = 2

function ordinal(place: number) {
  return place === 1 ? '1st' : place === 2 ? '2nd' : place === 3 ? '3rd' : `${place}th`
}

export function MobileFinal() {
  const me = FINAL_RESULTS[ME_INDEX]
  const place = ME_INDEX + 1

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pb-8 pt-10">
      {/* Deck subtitle */}
      <p className="text-center text-sm uppercase tracking-wider text-muted-foreground">
        {GAME_SUMMARY.deckTitle}
      </p>

      {/* Card */}
      <div className="mt-6 flex flex-1 flex-col items-center rounded-[2rem] border border-border bg-card/60 px-7 py-9 text-center">
        {/* Sparkle in ring */}
        <div className="grid size-24 place-items-center rounded-full border-2 border-brand">
          <span className="text-4xl" aria-hidden="true">
            {'\u2728'}
          </span>
        </div>

        <span className="mt-6 rounded-full bg-gold px-5 py-1.5 font-display text-sm font-black uppercase tracking-wide text-gold-foreground">
          {ordinal(place)} Place
        </span>

        <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-balance">
          You Placed #{place}!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Amazing run, {me.name}! You dominated the quick-fire questions.
        </p>

        <hr className="my-7 w-full border-border" />

        {/* Stats */}
        <div className="grid w-full grid-cols-2 divide-x divide-border">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Score
            </p>
            <p className="mt-1 font-display text-4xl font-black text-gold">
              {me.score.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Accuracy
            </p>
            <p className="mt-1 font-display text-4xl font-black text-success">
              {me.correct}/{GAME_SUMMARY.totalQuestions}
            </p>
          </div>
        </div>

        {/* Waiting pill */}
        <div className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-brand/40 px-5 py-3.5">
          <span className="size-2.5 animate-pulse rounded-full bg-brand" />
          <span className="font-semibold text-muted-foreground">Waiting for Host to replay…</span>
        </div>

        {/* CTA */}
        <Link
          href="/host"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-gold px-8 py-4 font-display text-lg font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform active:scale-[0.99]"
        >
          Play Again?
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        GatherFlix Party Room: {GAME_SUMMARY.partyRoom}
      </p>
    </div>
  )
}
