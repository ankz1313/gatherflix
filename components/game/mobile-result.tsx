'use client'

import Link from 'next/link'
import { AnswerShape } from '@/components/game/answer-shape'
import { ANSWER_STYLES, SAMPLE_QUESTION, GAME_META } from '@/lib/game'

export function MobileResult({ correct }: { correct: boolean }) {
  const style = ANSWER_STYLES[SAMPLE_QUESTION.correctIndex]

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-bold text-muted-foreground">
        Q{GAME_META.questionNumber}/{GAME_META.totalQuestions}
      </span>

      <div
        className="mt-8 grid size-24 place-items-center rounded-full"
        style={{
          backgroundColor: correct ? 'var(--success-soft)' : 'var(--brand-soft)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={correct ? 'var(--success)' : 'var(--brand)'}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-11"
          aria-hidden="true"
        >
          {correct ? <polyline points="20 6 9 17 4 12" /> : <path d="M18 6 6 18M6 6l12 12" />}
        </svg>
      </div>

      <h1 className="mt-6 font-display text-3xl font-black text-balance">
        {correct ? 'Correct!' : 'Not quite!'}
      </h1>

      {correct ? (
        <p className="mt-2 font-display text-lg font-bold text-gold">+{GAME_META.lastPoints} points</p>
      ) : (
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          Better luck on the next one.
        </p>
      )}

      {/* Correct answer reminder */}
      <div className="mt-8 flex w-full max-w-xs items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: style.color }}
        >
          <AnswerShape shape={style.shape} className="size-5 fill-white text-white" />
        </span>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Correct answer</p>
          <p className="font-display font-bold">{SAMPLE_QUESTION.options[SAMPLE_QUESTION.correctIndex]}</p>
        </div>
      </div>

      {/* Rank */}
      <div className="mt-4 flex w-full max-w-xs items-center justify-between rounded-2xl bg-secondary px-5 py-4">
        <span className="text-sm font-semibold text-muted-foreground">Your rank</span>
        <span className="font-display text-xl font-black">
          #{correct ? GAME_META.rankAfterCorrect : GAME_META.rankAfterWrong}
          <span className="ml-1 text-sm font-bold text-muted-foreground">
            / {GAME_META.playerCount}
          </span>
        </span>
      </div>

      <p className="mt-8 animate-pulse text-sm font-semibold text-muted-foreground">
        Waiting for the next question…
      </p>

      <Link
        href="/results"
        className="mt-6 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        Skip to final results
      </Link>
    </main>
  )
}
