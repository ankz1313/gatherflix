'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { MobileShell } from '@/components/mobile-shell'
import { AvatarBadge } from '@/components/join/avatar-badge'
import { AVATAR_STYLES } from '@/components/join/avatars'
import { parseRoomStatus } from '@/lib/room-phase'

type LivePlayer = {
  id: string
  nickname: string
  avatar: string | null
  you?: boolean
}

function LobbyContent() {
  const router = useRouter()
  const params = useSearchParams()
  const code = params.get('code') ?? ''
  const name = params.get('name') ?? 'You'
  const avatar = params.get('avatar') ?? AVATAR_STYLES[0].id

  const [players, setPlayers] = useState<LivePlayer[]>([])
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)

  // Register this player in the room via the API.
  useEffect(() => {
    if (!code || name.trim().length < 2) {
      setJoinError('Missing room code or nickname.')
      return
    }

    let cancelled = false

    // Stable per-browser identity so a rejoin/refresh (and React StrictMode's
    // double-invoke in dev) is idempotent rather than a "nickname taken" error.
    const tokenKey = `gf_player_token_${code}`
    let token = sessionStorage.getItem(tokenKey)
    if (!token) {
      token = crypto.randomUUID()
      sessionStorage.setItem(tokenKey, token)
    }

    async function join() {
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: name, avatar, token }),
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

  // Poll the real roster so everyone sees who just walked in.
  useEffect(() => {
    if (!joined || !code) return
    let cancelled = false

    async function loadPlayers() {
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/players`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        if (data.status && data.status !== 'lobby') {
          const phase = parseRoomStatus(data.status, data.questionIndex)
          if (phase.kind === 'finished') {
            router.push(`/results/mobile?code=${encodeURIComponent(code)}`)
          } else {
            router.push(`/play/mobile?code=${encodeURIComponent(code)}`)
          }
          return
        }
        const next = (data.players as { id: string; nickname: string; avatar: string | null }[]).map(
          (p) => ({
            id: p.id,
            nickname: p.nickname,
            avatar: p.avatar,
            you: p.nickname === name,
          }),
        )
        setPlayers(next)
      } catch (err) {
        console.error('[v0] failed to load lobby players:', err)
      }
    }

    loadPlayers()
    const interval = setInterval(loadPlayers, 2000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [joined, code, name, router])

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

          {players.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Connecting to the lobby…
            </p>
          ) : (
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
                    <AvatarBadge styleId={p.avatar ?? 'masala'} name={p.nickname} size={56} />
                  </span>
                  <span className="max-w-full truncate text-center font-display text-sm font-semibold text-foreground">
                    {p.you ? 'You' : p.nickname}
                  </span>
                </li>
              ))}
            </ul>
          )}
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
