'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnswerShape } from '@/components/game/answer-shape'
import { ANSWER_STYLES } from '@/lib/game'
import { lastAnswerStorageKey, type QuestionResult } from '@/lib/score'
import { parseRoomStatus } from '@/lib/room-phase'

type Choice = { label: string; text: string }

type MobileAnswerProps = {
  code: string
  questionIndex?: number
  round?: number
  totalQuestions?: number
  points?: number
  timerSeconds?: number
  choices: Choice[]
}

export function MobileAnswer({
  code,
  questionIndex = 0,
  round = 1,
  totalQuestions = 1,
  points = 250,
  timerSeconds = 20,
  choices,
}: MobileAnswerProps) {
  const router = useRouter()
  const [remaining, setRemaining] = useState(timerSeconds)
  const [locked, setLocked] = useState<string | null>(null)
  const submitting = useRef(false)
  const lockedRef = useRef(false)

  useEffect(() => {
    if (remaining > 0) {
      const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
      return () => clearTimeout(t)
    }
    if (!lockedRef.current) {
      void submit('')
    }
  }, [remaining])

  useEffect(() => {
    if (!code) return
    let cancelled = false

    async function followHost() {
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/players`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        const phase = parseRoomStatus(data.status)
        if (phase.kind === 'finished') {
          router.push(`/results/mobile?code=${encodeURIComponent(code)}`)
          return
        }
        if (phase.kind === 'playing' && phase.questionIndex > questionIndex) {
          router.push(`/play/mobile?code=${encodeURIComponent(code)}`)
          return
        }
        if (phase.kind === 'reveal' && phase.questionIndex === questionIndex && !lockedRef.current) {
          void submit('')
        }
      } catch {
        // Keep answering until the host moves on.
      }
    }

    followHost()
    const t = setInterval(followHost, 2000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [code, questionIndex, router])

  async function submit(letter: string) {
    if (submitting.current) return
    submitting.current = true
    lockedRef.current = true
    if (letter) setLocked(letter)

    const resultHref = `/play/mobile/result?code=${encodeURIComponent(code)}&q=${questionIndex}`
    const token = sessionStorage.getItem(`gf_player_token_${code}`)

    if (!token) {
      router.push(resultHref)
      return
    }

    const lockKey = `gf_scored_${code}_${questionIndex}`
    if (sessionStorage.getItem(lockKey)) {
      router.push(resultHref)
      return
    }
    sessionStorage.setItem(lockKey, '1')

    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          letter,
          questionIndex,
          timeRemaining: remaining,
        }),
      })
      const data = (await res.json()) as QuestionResult & { error?: string }
      if (res.ok) {
        sessionStorage.setItem(lastAnswerStorageKey(code), JSON.stringify(data))
      }
    } catch {
      // Result page still loads; it shows a fallback if scoring failed.
    }

    router.push(resultHref)
  }

  function pick(letter: string) {
    if (locked || submitting.current) return
    void submit(letter)
  }

  const pct = Math.max(0, (remaining / Math.max(1, timerSeconds)) * 100)

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pb-10 pt-8">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-lg font-black tracking-tight text-brand">
          ROUND {round} OF {totalQuestions}
        </span>
        <span className="font-display text-lg font-black tracking-tight text-gold">
          {points} PTS MAX
        </span>
      </div>

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

      <div className="mt-6 rounded-3xl border border-border bg-card/60 px-6 py-5 text-center">
        <h1 className="font-display text-2xl font-black tracking-tight text-balance">
          Pick your answer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Same letters as the TV — tap to lock in
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {choices.map((choice, i) => {
          const style = ANSWER_STYLES[i % ANSWER_STYLES.length]
          const isLocked = locked === choice.label
          return (
            <button
              key={choice.label}
              type="button"
              onClick={() => pick(choice.label)}
              disabled={!!locked}
              className="flex min-h-[4.75rem] items-center gap-4 rounded-3xl border-2 px-5 py-3 text-left transition-all active:scale-[0.99] disabled:cursor-default"
              style={
                isLocked
                  ? { backgroundColor: style.color, borderColor: style.color, color: '#fff' }
                  : {
                      borderColor: style.color,
                      background: `linear-gradient(90deg, ${style.soft}, transparent)`,
                    }
              }
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
                style={{ backgroundColor: style.color }}
              >
                <AnswerShape shape={style.shape} className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className="block font-display text-sm font-black"
                  style={{ color: isLocked ? '#fff' : style.color }}
                >
                  {choice.label}
                  {isLocked ? ' · LOCKED IN' : ''}
                </span>
                <span className="block font-display text-lg font-bold leading-snug text-balance">
                  {choice.text}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mx-auto mt-8 h-1.5 w-32 rounded-full bg-muted-foreground/30" />
    </div>
  )
}
