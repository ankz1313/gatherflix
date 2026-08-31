'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { MobileShell } from '@/components/mobile-shell'
import { AvatarBadge } from '@/components/join/avatar-badge'
import { AVATAR_STYLES } from '@/components/join/avatars'
import { JOIN_LOBBY_PLAYERS, type JoinPlayer } from '@/lib/session'

type Player = JoinPlayer & { you?: boolean }

// Simulated gang that trickles in so the lobby feels live.
const INCOMING: Player[] = JOIN_LOBBY_PLAYERS

function LobbyContent() {
  const params = useSearchParams()
  const code = params.get('code') ?? 'MASALA'
  const name = params.get('name') ?? 'You'
  const avatar = params.get('avatar') ?? AVATAR_STYLES[0].id

  const [players, setPlayers] = useState<Player[]>([{ id: 'you', name, avatar, you: true }])
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)

  // Register this player in the room via the API.
  useEffect(() => {
    let cancelled = false
    async function join() {
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: name, avatar }),
        })
        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) setJoinError(data.error ?? 'Could not join this room.')
          return
        }
        if (!cancelled) setJoined(true)
      } catch {
        if (!cancelled) setJoinError('Could not reach the server. Please try again.')
      }
    }
    join()
    return () => {
      cancelled = true
    }
  }, [code, name, avatar])

  useEffect(() => {
    if (!joined) return
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
  }, [joined])

  if (joinError) {
    return (
      <MobileShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
          <h1 className="font-display text-3xl font-extrabold text-foreground text-balance">
            Couldn&apos;t join
          </h1>
          <p className="max-w-xs text-muted-foreground text-pretty">{joinError}</p>
          <Link
            href={`/join/nickname?code=${encodeURIComponent(code)}`}
            className="rounded-full bg-gold px-6 py-3 font-display font-bold text-gold-foreground"
          >
            Try a different nickname
          </Link>
        </div>
      </MobileShell>
    )
  }

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
