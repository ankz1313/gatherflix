'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { MobileShell } from '@/components/mobile-shell'
import { AvatarBadge } from '@/components/join/avatar-badge'
import { AVATAR_STYLES } from '@/components/join/avatars'

type Player = { id: string; name: string; avatar: string; you?: boolean }

// Simulated gang that trickles in so the lobby feels live.
const INCOMING: Player[] = [
  { id: 'p1', name: 'Priya', avatar: 'royal' },
  { id: 'p2', name: 'Arjun', avatar: 'neon' },
  { id: 'p3', name: 'Meera', avatar: 'mint' },
  { id: 'p4', name: 'Vikram', avatar: 'chili' },
  { id: 'p5', name: 'Anjali', avatar: 'gold' },
]

function LobbyContent() {
  const params = useSearchParams()
  const code = params.get('code') ?? 'MASALA'
  const name = params.get('name') ?? 'You'
  const avatar = params.get('avatar') ?? AVATAR_STYLES[0].id

  const [players, setPlayers] = useState<Player[]>([{ id: 'you', name, avatar, you: true }])

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i >= INCOMING.length) {
        clearInterval(timer)
        return
      }
      setPlayers((prev) => [...prev, INCOMING[i]])
      i++
    }, 1400)
    return () => clearInterval(timer)
  }, [])

  return (
    <MobileShell>
      <div className="flex flex-1 flex-col gap-8 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-brand">
            You&apos;re in
          </span>
          <h1 className="font-display text-[2.5rem] font-extrabold leading-none text-foreground text-balance">
            Waiting Lobby
          </h1>
          <p className="text-[0.95rem] text-muted-foreground">
            Room code
          </p>
          <div className="font-display text-4xl font-extrabold tracking-[0.3em] text-gold">
            {code}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-foreground">
              Players
            </span>
            <span className="font-display text-sm font-bold text-brand">
              {players.length} joined
            </span>
          </div>

          <ul className="grid grid-cols-3 gap-4">
            {players.map((p) => (
              <li key={p.id} className="flex flex-col items-center gap-2">
                <span
                  className={
                    p.you
                      ? 'rounded-full ring-2 ring-gold ring-offset-2 ring-offset-card'
                      : ''
                  }
                >
                  <AvatarBadge styleId={p.avatar} name={p.name} size={56} />
                </span>
                <span className="max-w-full truncate text-center font-display text-sm font-semibold text-foreground">
                  {p.you ? 'You' : p.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-center justify-center gap-3 rounded-2xl border border-border bg-secondary/40 py-4">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-brand" />
          </span>
          <span className="font-display text-base font-semibold text-muted-foreground">
            Waiting for host to start the game
          </span>
        </div>
      </div>
    </MobileShell>
  )
}

export default function LobbyPage() {
  return (
    <Suspense fallback={null}>
      <LobbyContent />
    </Suspense>
  )
}
