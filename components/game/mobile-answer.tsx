'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnswerShape } from '@/components/game/answer-shape'
import { ANSWER_STYLES, SAMPLE_QUESTION, GAME_META } from '@/lib/game'

export function MobileAnswer() {
  const router = useRouter()
  const [remaining, setRemaining] = useState(GAME_META.timerSeconds)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])

  function choose(index: number) {
    if (picked !== null) return
    setPicked(index)
    // Store the pick so the result screen can grade it.
    const correct = index === SAMPLE_QUESTION.correctIndex
    setTimeout(() => {
      router.push(`/play/mobile/result?correct=${correct ? '1' : '0'}`)
    }, 1200)
  }

  return (
    <main className="flex min-h-[100dvh] flex-col px-4 pb-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-secondary px-4 py-1.5 font-display text-xs font-bold text-muted-foreground">
          Q{GAME_META.questionNumber}/{GAME_META.totalQuestions}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-lg font-black text-gold-foreground">
          {remaining}
        </span>
      </div>

      {/* Question */}
      <p className="mt-6 text-center font-display text-xl font-extrabold text-balance">
        {SAMPLE_QUESTION.prompt}
      </p>

      {picked !== null && (
        <p className="mt-3 text-center text-sm font-semibold text-muted-foreground">
          Answer locked in — hang tight!
        </p>
      )}

      {/* Answer tiles */}
      <div className="mt-6 grid flex-1 grid-cols-2 gap-3">
        {SAMPLE_QUESTION.options.map((option, i) => {
          const style = ANSWER_STYLES[i]
          const isPicked = picked === i
          const dimmed = picked !== null && !isPicked
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(i)}
              disabled={picked !== null}
              aria-label={`Answer ${option}`}
              className="flex flex-col items-center justify-center gap-3 rounded-3xl p-4 font-display text-lg font-bold text-white transition-all active:scale-95"
              style={{
                backgroundColor: style.color,
                opacity: dimmed ? 0.35 : 1,
                outline: isPicked ? '4px solid white' : 'none',
                outlineOffset: isPicked ? '-4px' : '0',
              }}
            >
              <AnswerShape shape={style.shape} className="size-9 fill-white text-white" />
              <span className="text-balance text-center">{option}</span>
            </button>
          )
        })}
      </div>
    </main>
  )
}
