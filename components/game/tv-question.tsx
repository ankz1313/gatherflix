'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SAMPLE_QUESTION, GAME_META } from '@/lib/game'
import { GatherflixLogo } from '@/components/gatherflix-logo'

export function TvQuestion() {
  const [remaining, setRemaining] = useState(GAME_META.timerSeconds)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])

  const pct = (remaining / GAME_META.timerSeconds) * 100

  return (
    <main className="flex min-h-[100dvh] flex-col">
      {/* Top bar */}
      <div className="container-page flex items-center justify-between py-6">
        <GatherflixLogo />
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand">
          <span aria-hidden="true">{'\u{1F3AC}'}</span> Live Party Screen
        </span>
      </div>

      <div className="container-page flex flex-1 flex-col justify-center gap-10 pb-10">
        {/* Film still banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border">
          <div className="relative aspect-[21/8]">
            <Image
              src={SAMPLE_QUESTION.image}
              alt={SAMPLE_QUESTION.imageAlt}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>
          <span className="absolute left-6 top-6 rounded-full bg-brand px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand-foreground">
            Question {String(GAME_META.questionNumber).padStart(2, '0')} of{' '}
            {GAME_META.totalQuestions}
          </span>
        </div>

        {/* Question */}
        <div className="text-center">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-5xl">
            {SAMPLE_QUESTION.prompt}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Category: {SAMPLE_QUESTION.category} &bull; {SAMPLE_QUESTION.points} Pts
          </p>
        </div>

        {/* Footer stats */}
        <div className="grid grid-cols-3 items-center">
          <div className="text-center">
            <p className="font-display text-3xl font-black text-gold">
              {GAME_META.playersLockedIn} / {GAME_META.playerCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Players Locked In</p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/play/reveal"
              className="relative grid size-24 place-items-center"
              aria-label="Reveal answer"
            >
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={((100 - pct) / 100) * 2 * Math.PI * 44}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="font-display text-3xl font-black">{remaining}</span>
            </Link>
          </div>

          <div className="text-center">
            <p className="font-display text-2xl font-black text-brand">HURRY UP!</p>
            <p className="mt-1 text-sm text-muted-foreground">Decaying multiplier</p>
          </div>
        </div>
      </div>
    </main>
  )
}
