'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Clapperboard, Copy, Play } from 'lucide-react'
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

const roomCreates = new Map<string, Promise<string>>()

async function ensureLobbyRoom(quizId: string): Promise<string> {
  const storageKey = `gf_host_room_${quizId}`
  const existing = sessionStorage.getItem(storageKey)
  if (existing) {
    const lookup = await fetch(`/api/rooms/${encodeURIComponent(existing)}`, { cache: 'no-store' })
    const lookupData = await lookup.json()
    if (lookup.ok && lookupData.valid && lookupData.room?.status === 'lobby') {
      return existing
    }
    sessionStorage.removeItem(storageKey)
  }

  const inflight = roomCreates.get(quizId)
  if (inflight) return inflight

  const promise = (async () => {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId }),
    })
    if (!res.ok) throw new Error('Failed to create room')
    const data = await res.json()
    const nextCode = data.room.code as string
    sessionStorage.setItem(storageKey, nextCode)
    return nextCode
  })().finally(() => {
    roomCreates.delete(quizId)
  })

  roomCreates.set(quizId, promise)
  return promise
}

export function RoomCreated({ quizId, quizTitle }: RoomCreatedProps) {
  const router = useRouter()
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [joined, setJoined] = useState<JoinedPlayer[]>([])
  const [origin, setOrigin] = useState('')
  const [starting, setStarting] = useState(false)
  const [countdown, setCountdown] = useState<number | 'go' | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  // Reuse the lobby room for this quiz in this browser tab, or create one.
  useEffect(() => {
    let cancelled = false
    async function createRoom() {
      setError(false)
      try {
        const nextCode = await ensureLobbyRoom(quizId)
        if (!cancelled) setCode(nextCode)
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
        const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/players`, {
          cache: 'no-store',
        })
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
  const joinPageDisplay = origin
    ? `${origin.replace(/^https?:\/\//, '')}/join`
    : 'gatherflix-6j.vercel.app/join'
  const canStart = !!code && !starting

  async function copyJoinLink() {
    if (!joinUrl) return
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  async function handleStart() {
    if (!code || !canStart) return
    setStarting(true)
    setStartError(null)
    try {
      let startPromise: Promise<Response> | null = null
      for (const n of [3, 2, 1] as const) {
        setCountdown(n)
        const tick = new Promise<void>((resolve) => window.setTimeout(resolve, 1000))
        if (n === 1) {
          startPromise = fetch(`/api/rooms/${encodeURIComponent(code)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'playing', questionIndex: 0 }),
          })
        }
        await tick
      }
      setCountdown('go')
      const res = await startPromise!
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Could not start the game.')
      }
      router.push(`/play?code=${encodeURIComponent(code)}&q=0`)
    } catch (err) {
      console.error('[v0] failed to start game:', err)
      setStartError('Could not start the game. Please try again.')
      setCountdown(null)
      setStarting(false)
    }
  }

  const codeDigits = code ? code.split('') : Array(6).fill('')

  return (
    <main className="flex min-h-[100dvh] flex-col">
      {countdown !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#0a0509]/92 backdrop-blur-sm"
          role="status"
          aria-live="assertive"
          aria-label={countdown === 'go' ? 'Go' : `${countdown}`}
        >
          <div className="flex flex-col items-center">
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand">
              Get ready
            </p>
            <p
              key={countdown}
              className="mt-4 font-display text-[8rem] font-black leading-none text-gold sm:text-[10rem]"
            >
              {countdown === 'go' ? 'Go!' : countdown}
            </p>
          </div>
        </div>
      )}
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
              Scan the QR, or enter the code
            </h1>
          </div>

          <div className="flex flex-col items-center rounded-3xl border border-border bg-card/70 p-6">
            <p className="font-display text-lg font-bold">Scan with your camera</p>
            <p className="mt-1 text-center text-sm text-muted-foreground text-pretty">
              Opens the join page on your phone with this room already selected.
            </p>
            <div className="mt-5 grid size-64 place-items-center rounded-3xl bg-white p-4">
              {joinUrl ? (
                <QRCodeSVG value={joinUrl} size={208} bgColor="#ffffff" fgColor="#0a0509" level="M" />
              ) : (
                <div className="size-44 animate-pulse rounded-lg bg-neutral-200" aria-hidden="true" />
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
              6-digit room code
            </p>
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
          </div>
          <div className="rounded-3xl border border-border bg-card/70 p-5">
            <p className="font-display text-lg font-bold">Or type this on your phone</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Open the join page, then enter the 6-digit code.
            </p>
            <p className="mt-4 break-all font-display text-xl font-extrabold tracking-tight text-gold sm:text-2xl">
              {joinPageDisplay}
            </p>
            {joinUrl && (
              <button
                type="button"
                onClick={() => void copyJoinLink()}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft px-4 py-2 font-display text-sm font-bold text-brand"
              >
                {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                {copied ? 'Copied join link' : 'Copy join link'}
              </button>
            )}
            {joinUrl && (
              <p className="mt-3 break-all text-xs text-muted-foreground">{joinUrl}</p>
            )}
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
            onClick={() => void handleStart()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gold px-8 py-4 font-display text-lg font-black uppercase tracking-wide text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting ? 'Starting…' : 'Start the Trivia Night'}
            <Play className="size-5 fill-current" aria-hidden="true" />
          </button>
          {startError && (
            <p className="mt-2 text-center text-sm font-semibold text-brand" role="alert">
              {startError}
            </p>
          )}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Join on your phone with the code, then start. Host holds controller.
          </p>
        </section>
      </div>
    </main>
  )
}
