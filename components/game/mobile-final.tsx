'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShareActions } from '@/components/share-actions'
import { SITE_URL } from '@/lib/site'

function ordinal(place: number) {
  return place === 1 ? '1st' : place === 2 ? '2nd' : place === 3 ? '3rd' : `${place}th`
}

type LiveMe = {
  nickname: string
  score: number
  rank: number
  playerCount: number
}

export function MobileFinal({ code }: { code: string }) {
  const [me, setMe] = useState<LiveMe | null>(null)

  useEffect(() => {
    if (!code) return
    let cancelled = false

    async function load() {
      const token = sessionStorage.getItem(`gf_player_token_${code}`)
      if (!token) return
      try {
        const res = await fetch(
          `/api/rooms/${encodeURIComponent(code)}/me?token=${encodeURIComponent(token)}`,
          { cache: 'no-store' },
        )
        if (!res.ok) return
        const data = (await res.json()) as LiveMe
        if (!cancelled) setMe(data)
      } catch {
        // Keep last known placement.
      }
    }

    load()
    const t = setInterval(load, 2000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [code])

  const place = me?.rank ?? 0

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pb-8 pt-10">
      <p className="text-center text-sm uppercase tracking-wider text-muted-foreground">
        Final results
      </p>

      <div className="mt-6 flex flex-1 flex-col items-center rounded-[2rem] border border-border bg-card/60 px-7 py-9 text-center">
        <div className="grid size-24 place-items-center rounded-full border-2 border-brand">
          <span className="text-4xl" aria-hidden="true">
            {'\u2728'}
          </span>
        </div>

        <span className="mt-6 rounded-full bg-gold px-5 py-1.5 font-display text-sm font-black uppercase tracking-wide text-gold-foreground">
          {place ? `${ordinal(place)} Place` : 'Tallying scores'}
        </span>

        <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-balance">
          {place ? `You Placed #${place}!` : 'Hang tight'}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          {me?.nickname
            ? `Nice run, ${me.nickname}. Watch the TV for the full podium.`
            : 'Your score is coming in from the live room.'}
        </p>

        <hr className="my-7 w-full border-border" />

        <div className="grid w-full grid-cols-2 divide-x divide-border">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Score
            </p>
            <p className="mt-1 font-display text-4xl font-black text-gold">
              {(me?.score ?? 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Rank
            </p>
            <p className="mt-1 font-display text-4xl font-black text-success">
              {place ? `#${place}` : '—'}
            </p>
          </div>
        </div>

        <div className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-brand/40 px-5 py-3.5">
          <span className="size-2.5 animate-pulse rounded-full bg-brand" />
          <span className="font-semibold text-muted-foreground">
            {me?.playerCount ? `${me.playerCount} players on the board` : 'Waiting for Host…'}
          </span>
        </div>

        <Link
          href="/join"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-gold px-8 py-4 font-display text-lg font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform active:scale-[0.99]"
        >
          Play Again?
        </Link>
        <Link
          href="/"
          className="mt-3 flex w-full items-center justify-center rounded-2xl border border-border bg-secondary/70 px-8 py-4 font-display text-lg font-bold text-foreground"
        >
          Home
        </Link>
        <div className="mt-5 w-full text-left">
          <ShareActions
            url={`${SITE_URL}/results?code=${encodeURIComponent(code)}`}
            text={
              place
                ? `I placed #${place} on GatherFlix.`
                : 'Check out our GatherFlix trivia night results.'
            }
          />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        GatherFlix Party Room: {code || '—'}
      </p>
    </div>
  )
}
