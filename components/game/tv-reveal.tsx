'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { AnswerShape } from '@/components/game/answer-shape'
import { AvatarBadge } from '@/components/join/avatar-badge'
import {
  ANSWER_STYLES,
  SAMPLE_QUESTION,
  ANSWER_DISTRIBUTION,
  LEADERBOARD,
  GAME_META,
} from '@/lib/game'

export function TvReveal() {
  const maxVotes = Math.max(...ANSWER_DISTRIBUTION, 1)

  return (
    <main className="flex min-h-[100dvh] flex-col">
      <div className="container-page flex items-center justify-between py-6">
        <span className="rounded-full bg-secondary px-5 py-2 font-display text-sm font-bold text-muted-foreground">
          Question {GAME_META.questionNumber} / {GAME_META.totalQuestions}
        </span>
        <h2 className="font-display text-lg font-bold text-[oklch(0.72_0.15_155)]">Correct answer revealed</h2>
        <Link
          href="/postgame"
          className="rounded-full bg-gold px-6 py-2.5 font-display text-sm font-bold text-gold-foreground transition-transform hover:scale-[1.02]"
        >
          Next
        </Link>
      </div>

      <div className="container-page grid flex-1 items-center gap-10 pb-10 lg:grid-cols-[1.3fr_1fr]">
        {/* Distribution */}
        <div>
          <h1 className="max-w-3xl font-display text-3xl font-extrabold tracking-[-0.02em] text-balance lg:text-4xl">
            {SAMPLE_QUESTION.prompt}
          </h1>

          <div className="mt-8 flex flex-col gap-4">
            {SAMPLE_QUESTION.options.map((option, i) => {
              const style = ANSWER_STYLES[i]
              const votes = ANSWER_DISTRIBUTION[i]
              const isCorrect = i === SAMPLE_QUESTION.correctIndex
              return (
                <div key={option} className="flex items-center gap-4">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: style.color }}
                  >
                    <AnswerShape shape={style.shape} className="size-5 fill-white text-white" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold">
                        {option}
                        {isCorrect && (
                          <Check className="ml-2 inline size-5 text-[oklch(0.72_0.15_155)]" aria-label="Correct" />
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">{votes} votes</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(votes / maxVotes) * 100}%`,
                          backgroundColor: style.color,
                          opacity: isCorrect ? 1 : 0.5,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-4xl border border-border bg-card/70 p-7 backdrop-blur-sm">
          <h2 className="font-display text-2xl font-extrabold">Leaderboard</h2>
          <ol className="mt-5 flex flex-col gap-3">
            {LEADERBOARD.map((player, i) => (
              <li
                key={player.name}
                className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 p-3"
              >
                <span className="w-6 text-center font-display text-lg font-black text-muted-foreground">
                  {i + 1}
                </span>
                <AvatarBadge styleId={player.styleId} name={player.name} size={44} />
                <span className="flex-1 font-display text-lg font-bold">{player.name}</span>
                <span className="font-display text-lg font-black text-gold">
                  {player.score.toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  )
}
