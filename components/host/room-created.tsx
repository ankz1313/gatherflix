'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { AvatarBadge } from '@/components/join/avatar-badge'
import type { Deck } from '@/lib/decks'

const INCOMING = [
  { name: 'Priya', styleId: 'masala' },
  { name: 'Arjun', styleId: 'neon' },
  { name: 'Meera', styleId: 'royal' },
  { name: 'Dev', styleId: 'gold' },
  { name: 'Sana', styleId: 'chili' },
  { name: 'Kabir', styleId: 'mint' },
  { name: 'Isha', styleId: 'masala' },
  { name: 'Rohan', styleId: 'neon' },
]

function useRoomCode() {
  // Stable per-mount 6-char code.
  return useMemo(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let out = ''
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
    return out
  }, [])
}

export function RoomCreated({ deck }: { deck: Deck }) {
  const code = useRoomCode()
  const [joined, setJoined] = useState<typeof INCOMING>([])
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  useEffect(() => {
    if (joined.length >= INCOMING.length) return
    const t = setTimeout(() => {
      setJoined((prev) => INCOMING.slice(0, prev.length + 1))
    }, 900)
    return () => clearTimeout(t)
  }, [joined])

  const joinUrl = origin ? `${origin}/join?code=${code}` : `/join?code=${code}`

  return (
    <main className="flex min-h-[100dvh] flex-col">
      {/* Top strip */}
      <div className="container-page flex items-center justify-between py-6">
        <p className="font-display text-lg font-bold">
          <span className="text-brand">Hosting:</span> {deck.title}
        </p>
        <Link
          href="/host"
          className="rounded-full border border-border bg-secondary px-5 py-2 font-display text-sm font-bold transition-colors hover:bg-accent"
        >
          Exit
        </Link>
      </div>

      <div className="container-page grid flex-1 items-center gap-10 pb-10 lg:grid-cols-[1fr_1fr]">
        {/* Join instructions */}
        <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Join at
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold tracking-tight lg:text-4xl">
              gatherflix-new.vercel.app
            </p>
          </div>

          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Room code
            </p>
            <p className="mt-1 font-display text-7xl font-black tracking-[0.15em] text-gold lg:text-8xl">
              {code}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-white p-5">
            <QRCodeSVG value={joinUrl} size={168} bgColor="#ffffff" fgColor="#0a0509" level="M" />
          </div>
          <p className="max-w-sm text-base text-muted-foreground">
            Scan the QR or enter the room code on your phone. No app needed.
          </p>
        </div>

        {/* Players */}
        <div className="rounded-4xl border border-border bg-card/70 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold">Players in the room</h2>
            <span className="rounded-full bg-brand-soft px-4 py-1.5 font-display text-sm font-bold text-brand">
              {joined.length} joined
            </span>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {joined.map((p) => (
              <li
                key={p.name}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background/60 p-4"
              >
                <AvatarBadge styleId={p.styleId} name={p.name} size={52} />
                <span className="font-display text-sm font-bold">{p.name}</span>
              </li>
            ))}
            {joined.length === 0 && (
              <li className="col-span-full py-10 text-center text-muted-foreground">
                Waiting for players to join…
              </li>
            )}
          </ul>

          <button
            type="button"
            disabled={joined.length === 0}
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-4 font-display text-lg font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {joined.length === 0 ? 'Waiting for players…' : `Start Game with ${joined.length} players`}
          </button>
        </div>
      </div>
    </main>
  )
}
