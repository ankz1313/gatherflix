'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Clapperboard, Play } from 'lucide-react'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { AvatarBadge } from '@/components/join/avatar-badge'
import { CURRENT_SESSION } from '@/lib/session'

type RoomCreatedProps = {
  quizId: string
  quizTitle: string
}

type JoinedPlayer = {
  id: string
  nickname: string
  avatar: string | null
  score: number
}

export function RoomCreated({ quizId, quizTitle }: RoomCreatedProps) {
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [joined, setJoined] = useState<JoinedPlayer[]>([])
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Create a real room in the database for this quiz.
  useEffect(() => {
    let cancelled = false
    async function createRoom() {
      setError(false)
      try {
        const res = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizId }),
        })
        if (!res.ok) throw new Error('Failed to create room')
        const data = await res.json()
        if (!cancelled) setCode(data.room.code as string)
      } catch (err) {
        console.error('[v0] room creation failed:', err)
        if (!cancelled) setError(true)
      }
    }
    createRoom()
    return () => {
      cancelled = true
    }
  }, [quizId])

  // Poll the live roster so real players appear as they scan/join.
  useEffect(() => {
    if (!code) return
    let cancelled = false

    async function loadPlayers() {
      try {
        const res = await fetch(`/api/rooms/${code}/players`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setJoined(data.players as JoinedPlayer[])
      } catch (err) {
        console.error('[v0] failed to load players:', err)
      }
    }

    loadPlayers()
    const interval = setInterval(loadPlayers, 2500)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [code])

  const joinUrl = code
    ? origin
      ? `${origin}/join?code=${code}`
      : `/join?code=${code}`
    : ''
  const canStart = !!code && joined.length >= CURRENT_SESSION.minPlayers
  const codeDigits = code ? code.split('') : Array(6).fill('')

  return (
    <main className="flex min-h-[100dvh] flex-col">
      {/* Header */}
      <header className="container-page flex items-center justify-between py-6">
        <GatherflixLogo />
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.15em] text-brand">
            <Clapperboard className="size-4" strokeWidth={2.5} aria-hidden="true" />
            Live Quiz Screen
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Body */}
      <div className="container-page grid flex-1 items-center gap-10 pb-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: how to join */}
        <section className="flex flex-col gap-8">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-brand">
              {quizTitle}
            </p>
            <h1 className="mt-3 font-display text-5xl font-black tracking-tight text-balance lg:text-6xl">
              Scan QR or Enter Code
            </h1>
          </div>

          {/* Segmented code */}
          <div className="rounded-3xl border-2 border-brand bg-background/40 p-4 shadow-[0_0_35px_-8px] shadow-brand/60">
            {error ? (
              <p className="py-6 text-center font-display text-lg font-bold text-brand">
                Could not create room. Please refresh to try again.
              </p>
            ) : (
              <div className="flex justify-between gap-2 sm:gap-3">
                {codeDigits.map((digit, i) => (
                  <div
                    key={i}
                    className="flex h-16 flex-1 items-center justify-center rounded-2xl bg-card font-display text-3xl font-black text-gold sm:h-20 sm:text-4xl"
                  >
                    {digit || (
                      <span className="animate-pulse text-muted-foreground" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scan with your camera */}
          <div className="flex items-center gap-5 rounded-3xl border border-border bg-card/70 p-5">
            <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-white p-2">
              {joinUrl ? (
                <QRCodeSVG value={joinUrl} size={80} bgColor="#ffffff" fgColor="#0a0509" level="M" />
              ) : (
                <div className="size-20 animate-pulse rounded-lg bg-neutral-200" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="font-display text-lg font-bold">Scan with your camera</p>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                Instantly join on your mobile browser. Choose your avatar look and nickname to enter
                the lobby!
              </p>
            </div>
          </div>
        </section>

        {/* Right: waiting room */}
        <section className="rounded-4xl border border-brand/30 bg-card/70 p-6 backdrop-blur-sm lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
              <span className="size-2.5 rounded-full bg-[var(--success)]" aria-hidden="true" />
              {CURRENT_SESSION.roomName}
            </h2>
            <span className="shrink-0 font-display text-sm font-bold text-gold">
              {joined.length} Players Joined
            </span>
          </div>

          <div className="my-6 h-px bg-border" />

          {joined.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-background/40 px-4 py-10 text-center text-sm text-muted-foreground text-pretty">
              Waiting for players to scan the code and join&hellip;
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {joined.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-background/60 p-2.5"
                >
                  <AvatarBadge styleId={p.avatar ?? 'masala'} name={p.nickname} size={36} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.8rem] font-bold leading-tight">
                      {p.nickname}
                    </p>
                    <p className="whitespace-nowrap text-[0.7rem] text-muted-foreground">
                      {p.score} Gold Pts
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            disabled={!canStart}
            className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gold px-8 py-4 font-display text-lg font-black uppercase tracking-wide text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start the Trivia Night
            <Play className="size-5 fill-current" aria-hidden="true" />
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Minimum {CURRENT_SESSION.minPlayers} players required. Host holds controller.
          </p>
        </section>
      </div>
    </main>
  )
}
