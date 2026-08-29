'use client'

import { useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Clapperboard, Play } from 'lucide-react'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import type { Deck } from '@/lib/decks'

type Player = { name: string; emoji: string; points: number }

const ROOM_PLAYERS: Player[] = [
  { name: 'Gabbar', emoji: '😎', points: 890 },
  { name: 'Basanti', emoji: '🍿', points: 720 },
  { name: 'Simran', emoji: '✨', points: 950 },
  { name: 'Raj', emoji: '🕺', points: 1100 },
  { name: 'Rahul', emoji: '👑', points: 1400 },
  { name: 'Pooja', emoji: '💃', points: 1200 },
  { name: 'Jai', emoji: '🤩', points: 850 },
  { name: 'Veeru', emoji: '🦁', points: 1050 },
]

function useRoomCode() {
  return useMemo(() => {
    let out = ''
    for (let i = 0; i < 6; i++) out += Math.floor(Math.random() * 10)
    return out
  }, [])
}

export function RoomCreated({ deck }: { deck: Deck }) {
  const code = useRoomCode()
  const [joined, setJoined] = useState<Player[]>([])
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    if (joined.length >= ROOM_PLAYERS.length) return
    const t = setTimeout(() => {
      setJoined((prev) => ROOM_PLAYERS.slice(0, prev.length + 1))
    }, 550)
    return () => clearTimeout(t)
  }, [joined])

  const joinUrl = origin ? `${origin}/join?code=${code}` : `/join?code=${code}`
  const canStart = joined.length >= 4

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
              How to join the party
            </p>
            <h1 className="mt-3 font-display text-5xl font-black tracking-tight text-balance lg:text-6xl">
              Scan QR or Enter Code
            </h1>
          </div>

          {/* Segmented code */}
          <div className="rounded-3xl border-2 border-brand bg-background/40 p-4 shadow-[0_0_35px_-8px] shadow-brand/60">
            <div className="flex justify-between gap-2 sm:gap-3">
              {code.split('').map((digit, i) => (
                <div
                  key={i}
                  className="flex h-16 flex-1 items-center justify-center rounded-2xl bg-card font-display text-3xl font-black text-gold sm:h-20 sm:text-4xl"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>

          {/* Scan with your camera */}
          <div className="flex items-center gap-5 rounded-3xl border border-border bg-card/70 p-5">
            <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-white p-2">
              <QRCodeSVG value={joinUrl} size={80} bgColor="#ffffff" fgColor="#0a0509" level="M" />
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
              Bollywood Waiting Room
            </h2>
            <span className="shrink-0 font-display text-sm font-bold text-gold">
              {joined.length} Players Joined
            </span>
          </div>

          <div className="my-6 h-px bg-border" />

          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ROOM_PLAYERS.map((p) => {
              const isIn = joined.some((j) => j.name === p.name)
              return (
                <li
                  key={p.name}
                  className={`flex items-center gap-2 rounded-2xl border border-border bg-background/60 p-2.5 transition-opacity duration-300 ${
                    isIn ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-lg"
                    aria-hidden="true"
                  >
                    {p.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.8rem] font-bold leading-tight">
                      {p.name}
                    </p>
                    <p className="whitespace-nowrap text-[0.7rem] text-muted-foreground">
                      {p.points} Gold Pts
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            disabled={!canStart}
            className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gold px-8 py-4 font-display text-lg font-black uppercase tracking-wide text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start the Trivia Night
            <Play className="size-5 fill-current" aria-hidden="true" />
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Minimum 4 players required. Host holds controller.
          </p>
        </section>
      </div>
    </main>
  )
}
