'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnswerShape } from '@/components/game/answer-shape'
import { ANSWER_STYLES, SAMPLE_QUESTION, GAME_META } from '@/lib/game'

export function TvQuestion() {
  const [remaining, setRemaining] = useState(GAME_META.timerSeconds)
  const [answered, setAnswered] = useState(0)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])

  useEffect(() => {
    if (answered >= 18) return
    const t = setTimeout(() => setAnswered((a) => Math.min(18, a + 1)), 700)
    return () => clearTimeout(t)
  }, [answered])

  const pct = (remaining / GAME_META.timerSeconds) * 100

  return (
    <main className="flex min-h-[100dvh] flex-col">
      {/* Top bar */}
      <div className="container-page flex items-center justify-between py-6">
        <span className="rounded-full bg-secondary px-5 py-2 font-display text-sm font-bold text-muted-foreground">
          Question {GAME_META.questionNumber} / {GAME_META.totalQuestions}
        </span>
        <span className="rounded-full bg-brand-soft px-5 py-2 font-display text-sm font-bold text-brand">
          {SAMPLE_QUESTION.category}
        </span>
        <Link
          href="/play/reveal"
          className="rounded-full border border-border bg-secondary px-5 py-2 font-display text-sm font-bold transition-colors hover:bg-accent"
        >
          Skip
        </Link>
      </div>

      {/* Question + timer */}
      <div className="container-page flex flex-1 flex-col items-center justify-center gap-10 py-6">
        <div className="flex flex-col items-center gap-8">
          {/* Timer ring */}
          <div className="relative grid h-28 w-28 place-items-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={((100 - pct) / 100) * 2 * Math.PI * 44}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="font-display text-4xl font-black text-gold">{remaining}</span>
          </div>

          <h1 className="max-w-4xl text-center font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-6xl">
            {SAMPLE_QUESTION.prompt}
          </h1>

          <p className="rounded-full bg-secondary px-5 py-2 font-display text-sm font-bold text-muted-foreground">
            {answered} players answered
          </p>
        </div>

        {/* Answer grid */}
        <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2">
          {SAMPLE_QUESTION.options.map((option, i) => {
            const style = ANSWER_STYLES[i]
            return (
              <div
                key={option}
                className="flex items-center gap-4 rounded-3xl p-6 lg:p-7"
                style={{ backgroundColor: style.soft, border: `1px solid ${style.color}` }}
              >
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                  style={{ backgroundColor: style.color }}
                >
                  <AnswerShape shape={style.shape} className="size-6 fill-white text-white" />
                </span>
                <span className="font-display text-2xl font-bold lg:text-3xl">{option}</span>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
