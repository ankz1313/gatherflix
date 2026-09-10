'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { AvatarBadge } from '@/components/join/avatar-badge'

type RevealChoice = { label: string; text: string; correct: boolean }
type Leader = { name: string; avatar: string | null; score: number }

export function TvReveal({
  code,
  choices,
  leaders: initialLeaders,
  nextLabel,
  nextStatus,
  nextQuestionIndex,
  nextHref,
}: {
  code: string
  choices: RevealChoice[]
  leaders: Leader[]
  nextLabel: string
  nextStatus: 'playing' | 'finished'
  nextQuestionIndex: number
  nextHref: string
}) {
  const router = useRouter()
  const [leaders, setLeaders] = useState(initialLeaders)
  const [finishing, setFinishing] = useState(false)
  const leaving = useRef(false)
  const correct = choices.find((choice) => choice.correct)

  async function goNext() {
    if (leaving.current) return
    leaving.current = true
    setFinishing(true)
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(code)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, questionIndex: nextQuestionIndex }),
      })
      if (!res.ok) {
        leaving.current = false
        setFinishing(false)
        return
      }
    } catch {
      leaving.current = false
      setFinishing(false)
      return
    }
    router.push(nextHref)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      void goNext()
    }, 6000)
    return () => clearTimeout(t)
  }, [code, nextHref, nextStatus, nextQuestionIndex])

  useEffect(() => {
    setLeaders(initialLeaders)
  }, [initialLeaders])

  useEffect(() => {
    if (!code) return
    let cancelled = false

    async function refresh() {
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/players`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        const next = (data.players ?? []) as {
          nickname: string
          avatar: string | null
          score: number
        }[]
        if (cancelled) return
        setLeaders(
          [...next]
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .map((p) => ({ name: p.nickname, avatar: p.avatar, score: p.score ?? 0 })),
        )
      } catch {
        // Keep last known scores.
      }
    }

    refresh()
    const t = setInterval(refresh, 2000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [code])

  return (
    <main className="flex min-h-[100dvh] flex-col">
      <div className="container-page flex items-center justify-between py-6">
        <GatherflixLogo />
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand">
          <span aria-hidden="true">{'\u{1F3AC}'}</span> Live Party Screen
        </span>
      </div>

      <div className="container-page grid flex-1 gap-8 pb-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-gold">
            Correct Answer
          </p>
          <div className="mt-3 rounded-2xl border-2 border-success bg-success-soft px-6 py-4">
            <span className="font-display text-3xl font-extrabold text-success">
              {correct ? `${correct.label}. ${correct.text}` : '—'}
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-card/40 p-6">
            <h2 className="font-display text-xl font-bold">All options</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {choices.map((option) => (
                <li
                  key={option.label}
                  className={`rounded-2xl border px-4 py-3 font-display text-base font-bold ${
                    option.correct
                      ? 'border-success bg-success-soft text-success'
                      : 'border-border'
                  }`}
                >
                  {option.label}. {option.text}
                  {option.correct && (
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
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold">
              Live scores <span aria-hidden="true">{'\u2B50'}</span>
            </h2>
            <span className="text-sm text-muted-foreground">{leaders.length} players</span>
          </div>

          <ol className="mt-5 flex flex-col gap-3">
            {leaders.slice(0, 5).map((player, i) => (
              <li
                key={`${player.name}-${i}`}
                className={`flex items-center gap-3 rounded-2xl border p-4 ${
                  i === 0 ? 'border-gold bg-gold-soft/40' : 'border-border bg-background/50'
                }`}
              >
                <span className="w-6 text-center font-display text-lg font-black text-muted-foreground">
                  {i === 0 ? '\u{1F451}' : i + 1}
                </span>
                <AvatarBadge styleId={player.avatar ?? 'masala'} name={player.name} size={40} />
                <span className="flex-1 font-display text-lg font-bold">{player.name}</span>
                <span className="font-display text-lg font-black">
                  {player.score.toLocaleString()}
                </span>
              </li>
            ))}
            {leaders.length === 0 && (
              <li className="text-sm text-muted-foreground">No players in this room yet.</li>
            )}
          </ol>

          <button
            type="button"
            disabled={finishing}
            onClick={() => void goNext()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-8 py-4 font-display text-base font-bold uppercase tracking-wide text-gold-foreground transition-transform hover:scale-[1.01] disabled:opacity-70"
          >
            {nextLabel}
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  )
}
