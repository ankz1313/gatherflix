'use client'

import Link from 'next/link'
import { SAMPLE_QUESTION, ANSWER_DISTRIBUTION, STAR_LEADERBOARD, GAME_META } from '@/lib/game'
import { GatherflixLogo } from '@/components/gatherflix-logo'

const LETTERS = ['A', 'B', 'C', 'D']

export function TvReveal() {
  const total = ANSWER_DISTRIBUTION.reduce((a, b) => a + b, 0) || 1
  const correct = SAMPLE_QUESTION.options[SAMPLE_QUESTION.correctIndex]

  return (
    <main className="flex min-h-[100dvh] flex-col">
      <div className="container-page flex items-center justify-between py-6">
        <GatherflixLogo />
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand">
          <span aria-hidden="true">{'\u{1F3AC}'}</span> Live Party Screen
        </span>
      </div>

      <div className="container-page grid flex-1 gap-8 pb-10 lg:grid-cols-2 lg:items-start">
        {/* Left: correct answer + distribution */}
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
            Correct Answer
          </p>
          <div className="mt-3 rounded-2xl border-2 border-success bg-success-soft px-6 py-4">
            <span className="font-display text-3xl font-extrabold text-success">
              {LETTERS[SAMPLE_QUESTION.correctIndex]}. {correct}
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-card/40 p-6">
            <h2 className="font-display text-xl font-bold">Answer Distribution</h2>
            <ul className="mt-5 flex flex-col gap-5">
              {SAMPLE_QUESTION.options.map((option, i) => {
                const votes = ANSWER_DISTRIBUTION[i]
                const share = Math.round((votes / total) * 100)
                const isCorrect = i === SAMPLE_QUESTION.correctIndex
                return (
                  <li key={option}>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-display text-base font-bold ${
                          isCorrect ? 'text-success' : ''
                        }`}
                      >
                        {LETTERS[i]}. {option}
                        {isCorrect && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="ml-1.5 inline size-4 align-[-2px] text-success"
                            aria-label="Correct"
                          >
                            <path
                              d="m5 12 4.5 4.5L19 7"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`font-display text-sm font-bold ${
                          isCorrect ? 'text-success' : 'text-muted-foreground'
                        }`}
                      >
                        {votes} {votes === 1 ? 'Player' : 'Players'} ({share}%)
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${isCorrect ? 'bg-success' : 'bg-muted-foreground/50'}`}
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Right: Top 5 Stars */}
        <div className="rounded-3xl border border-border bg-card/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold">
              Top 5 Stars <span aria-hidden="true">{'\u2B50'}</span>
            </h2>
            <span className="text-sm text-muted-foreground">Round {GAME_META.round} deltas</span>
          </div>

          <ol className="mt-5 flex flex-col gap-3">
            {STAR_LEADERBOARD.map((player, i) => (
              <li
                key={player.name}
                className={`flex items-center gap-3 rounded-2xl border p-4 ${
                  player.host
                    ? 'border-gold bg-gold-soft/40'
                    : 'border-border bg-background/50'
                }`}
              >
                <span className="w-6 text-center font-display text-lg font-black text-muted-foreground">
                  {player.host ? '\u{1F451}' : i + 1}
                </span>
                <span className="text-2xl" aria-hidden="true">
                  {player.emoji}
                </span>
                <span className="flex-1 font-display text-lg font-bold">{player.name}</span>
                <span className="font-display text-lg font-black">
                  {player.score.toLocaleString()}
                </span>
                <span
                  className={`w-14 text-right font-display text-sm font-bold ${
                    player.delta > 0 ? 'text-success' : 'text-brand'
                  }`}
                >
                  +{player.delta}
                </span>
              </li>
            ))}
          </ol>

          <Link
            href="/results"
            className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gold px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-gold-foreground transition-transform hover:scale-[1.01]"
          >
            Next Question
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}
