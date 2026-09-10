'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { lastAnswerStorageKey, type QuestionResult } from '@/lib/score'
import { parseRoomStatus } from '@/lib/room-phase'

export function MobileResult({ code, questionIndex }: { code: string; questionIndex: number }) {
  const router = useRouter()
  const [result, setResult] = useState<QuestionResult | null>(null)

  useEffect(() => {
    if (!code) return
    const raw = sessionStorage.getItem(lastAnswerStorageKey(code))
    if (!raw) return
    try {
      setResult(JSON.parse(raw) as QuestionResult)
    } catch {
      setResult(null)
    }
  }, [code])

  useEffect(() => {
    if (!code) return
    let cancelled = false
    const playHref = `/play/mobile?code=${encodeURIComponent(code)}`
    const finalHref = `/results/mobile?code=${encodeURIComponent(code)}`

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
          router.push(finalHref)
          return
        }
        if (phase.kind === 'playing' && phase.questionIndex > questionIndex) {
          router.push(playHref)
        }
      } catch {
        // Stay on the round result until the host advances.
      }
    }

    followHost()
    const t = setInterval(followHost, 2000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [code, questionIndex, router])

  const correct = result?.correct ?? false
  const accent = correct ? 'var(--success)' : 'var(--brand)'

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
      <div className="w-full rounded-[2rem] border border-border bg-card/70 px-7 py-9 text-center">
        <div
          className="mx-auto grid h-14 w-28 place-items-center rounded-full border-2"
          style={{ borderColor: accent, backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)` }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-7" style={{ color: accent }}>
            {correct ? (
              <path
                d="m5 12 4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>

        <h1
          className="mt-6 font-display text-5xl font-black tracking-tight"
          style={{ color: accent }}
        >
          {result ? (correct ? 'CORRECT!' : 'MISSED IT!') : 'LOCKED IN'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {result
            ? `You chose: ${result.chosenLetter}. ${result.chosenText}`
            : 'Waiting for your score…'}
        </p>

        <hr className="my-7 border-border" />

        <p className="font-display text-6xl font-black tracking-tight text-gold">
          {result ? `${result.awarded > 0 ? '+' : ''}${result.awarded}` : '—'} PTS
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="rounded-full bg-success-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-success">
            Base: {result?.base ?? 0}
          </span>
          <span className="rounded-full bg-gold-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-gold">
            Speed Multiplier: {result?.multiplier ?? '—'}
          </span>
        </div>

        <hr className="my-7 border-border" />

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current Rank
            </p>
            <p className="mt-1 font-display text-2xl font-black">
              {result ? `#${result.rank}` : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total Score
            </p>
            <p className="mt-1 font-display text-2xl font-black">
              {result ? result.totalScore.toLocaleString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Behind Next
            </p>
            <p className="mt-1 font-display text-2xl font-black text-brand">
              {result ? result.behindNext : '—'}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">Waiting for the next question on the TV…</p>
    </div>
  )
}
