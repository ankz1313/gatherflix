'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { AdaptiveStill } from '@/components/game/adaptive-still'
import { AnswerShape } from '@/components/game/answer-shape'
import { ANSWER_STYLES } from '@/lib/game'
import { parseHostPace, paceStorageKey, withHostPace, type HostPace } from '@/lib/host-pace'

type TvQuestionProps = {
  code: string
  questionIndex: number
  prompt: string
  category: string | null
  points: number
  imageUrl: string | null
  upcomingImageUrls?: string[]
  questionNumber: number
  totalQuestions: number
  timerSeconds: number
  playerCount: number
  revealHref: string
  choices: { label: string; text: string }[]
  pace?: HostPace
}

export function TvQuestion({
  code,
  questionIndex,
  prompt,
  category,
  points,
  imageUrl,
  upcomingImageUrls = [],
  questionNumber,
  totalQuestions,
  timerSeconds,
  playerCount,
  revealHref,
  choices,
  pace: paceProp = 'auto',
}: TvQuestionProps) {
  const router = useRouter()
  const [pace, setPace] = useState<HostPace>(paceProp)
  const [remaining, setRemaining] = useState(timerSeconds)
  const [lockedIn, setLockedIn] = useState(0)
  const [livePlayers, setLivePlayers] = useState(playerCount)
  const still = imageUrl?.trim() || null
  const leaving = useRef(false)

  useEffect(() => {
    setRemaining(timerSeconds)
  }, [timerSeconds])

  useEffect(() => {
    if (!code) return
    if (paceProp === 'manual') {
      sessionStorage.setItem(paceStorageKey(code), 'manual')
      setPace('manual')
      return
    }
    setPace(parseHostPace(sessionStorage.getItem(paceStorageKey(code))))
  }, [code, paceProp])

  useEffect(() => {
    void fetch(`/api/rooms/${encodeURIComponent(code)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'playing', questionIndex }),
    })
  }, [code, questionIndex])

  async function goToReveal() {
    if (leaving.current) return
    leaving.current = true
    router.push(withHostPace(revealHref, pace))
  }

  useEffect(() => {
    if (!code) return
    let cancelled = false

    async function checkAnswers() {
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/players`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        const humans = typeof data.playerCount === 'number' ? data.playerCount : playerCount
        const answered = typeof data.answeredCount === 'number' ? data.answeredCount : 0
        setLivePlayers(humans)
        setLockedIn(answered)
        if (pace !== 'manual' && humans > 0 && answered >= humans) {
          void goToReveal()
        }
      } catch {
        // Keep the timer running until everyone has locked in.
      }
    }

    checkAnswers()
    const t = setInterval(checkAnswers, 1000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [code, playerCount, revealHref, pace])

  useEffect(() => {
    if (remaining > 0) {
      const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
      return () => clearTimeout(t)
    }
    if (pace === 'manual') return
    const t = setTimeout(() => {
      void goToReveal()
    }, 800)
    return () => clearTimeout(t)
  }, [remaining, pace])

  const pct = timerSeconds > 0 ? (remaining / timerSeconds) * 100 : 0
  const roundLabel = `Question ${String(questionNumber).padStart(2, '0')} of ${totalQuestions}`

  return (
    <main className="flex min-h-[100dvh] flex-col">
      <div className="container-page flex items-center justify-between py-6">
        <GatherflixLogo />
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand">
          <span aria-hidden="true">{'\u{1F3AC}'}</span> Live Party Screen
        </span>
      </div>

      <div className="container-page flex flex-1 flex-col justify-center gap-10 pb-10">
        {still ? (
          <div className="relative overflow-hidden rounded-3xl border border-border bg-[#12080f]">
            <span className="absolute left-6 top-6 z-10 rounded-full bg-brand px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand-foreground">
              {roundLabel}
            </span>
            <div className="flex items-center justify-center px-4 py-10 sm:py-12">
              <AdaptiveStill
                src={still}
                priority
                upcomingSrcs={upcomingImageUrls}
                className="h-auto max-h-[min(52vh,32rem)] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="rounded-full bg-brand px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand-foreground">
              {roundLabel}
            </span>
          </div>
        )}

        <div className="text-center">
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-5xl">
            {prompt}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {category ? `Category: ${category} • ` : ''}
            {points} Pts
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {choices.map((choice, i) => {
            const style = ANSWER_STYLES[i % ANSWER_STYLES.length]
            return (
              <div
                key={choice.label}
                className="flex items-center gap-4 rounded-2xl border-2 px-5 py-4"
                style={{
                  borderColor: style.color,
                  background: `linear-gradient(90deg, ${style.soft}, transparent)`,
                }}
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: style.color }}
                >
                  <AnswerShape shape={style.shape} className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-black" style={{ color: style.color }}>
                    {choice.label}
                  </p>
                  <p className="font-display text-lg font-bold text-balance">{choice.text}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-3 items-center">
          <div className="text-center">
            <p className="font-display text-3xl font-black text-gold">{livePlayers}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {lockedIn}/{livePlayers} locked in
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void goToReveal()}
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
            </button>
          </div>

          <div className="text-center">
            <p className="font-display text-2xl font-black text-brand">
              {pace === 'manual' ? 'HOST PACE' : 'HURRY UP!'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {pace === 'manual' ? 'Tap the timer to reveal' : 'Decaying multiplier'}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
