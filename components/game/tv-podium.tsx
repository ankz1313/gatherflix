'use client'

import Link from 'next/link'
import { AvatarBadge } from '@/components/join/avatar-badge'

export type Standing = {
  name: string
  avatar: string | null
  score: number
}

function ordinal(place: number) {
  return place === 1 ? '1st' : place === 2 ? '2nd' : place === 3 ? '3rd' : `${place}th`
}

const PODIUM_STYLE = [
  { place: 2, height: 'h-32', block: 'bg-secondary', num: 'text-muted-foreground', medal: '\u{1F948}' },
  { place: 1, height: 'h-44', block: 'bg-gold/10 border-2 border-gold', num: 'text-gold', medal: '\u{1F947}' },
  { place: 3, height: 'h-24', block: 'bg-secondary', num: 'text-muted-foreground', medal: '\u{1F949}' },
] as const

export function TvPodium({
  quizTitle,
  roomCode,
  standings,
}: {
  quizTitle: string
  roomCode: string
  standings: Standing[]
}) {
  const first = standings[0]
  const second = standings[1]
  const third = standings[2]
  const byPlace: Record<number, Standing | undefined> = { 1: first, 2: second, 3: third }

  return (
    <main className="min-h-[100dvh] px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-brand font-display text-lg font-black text-brand-foreground">
            G
          </span>
          <span className="font-display text-xl font-black tracking-tight">
            GATHER<span className="text-gold">FLIX</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand/10 px-4 py-1.5 font-display text-sm font-bold text-brand">
          {'\u{1F3C6}'} FINAL STANDINGS
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col">
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-gold text-balance">
            {quizTitle}
          </h1>
          <p className="mt-2 text-muted-foreground">Room {roomCode}</p>

          <div className="mt-auto flex items-end justify-center gap-4 pt-14">
            {PODIUM_STYLE.map(({ place, height, block, num, medal }) => {
              const player = byPlace[place]
              if (!player) return <div key={place} className="w-28 sm:w-32" />
              return (
                <div key={place} className="flex w-28 flex-col items-center sm:w-32">
                  {place === 1 && <span className="mb-1 text-3xl">{'\u{1F451}'}</span>}
                  <span className="text-3xl" aria-hidden="true">
                    {medal}
                  </span>
                  <p className="mt-1 font-display text-lg font-extrabold">{player.name}</p>
                  <p
                    className={`font-display text-sm font-bold ${place === 1 ? 'text-gold' : 'text-brand'}`}
                  >
                    {player.score.toLocaleString()} pts
                  </p>
                  <div
                    className={`mt-3 flex w-full ${height} items-center justify-center rounded-2xl ${block}`}
                  >
                    <span className={`font-display text-4xl font-black ${num}`}>{place}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <Link
              href="/host"
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-display text-base font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02]"
            >
              Play Again
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-full border border-border bg-secondary/70 px-7 py-3.5 font-display text-base font-bold text-foreground transition-colors hover:bg-accent"
            >
              Choose New Quiz
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/60 p-6 sm:p-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-black tracking-tight">
              Full Leaderboard {'\u{1F31F}'}
            </h2>
            <span className="text-sm text-muted-foreground">{standings.length} Players total</span>
          </div>

          <ul className="mt-6 space-y-2.5">
            {standings.map((p, i) => {
              const place = i + 1
              const isFirst = place === 1
              return (
                <li
                  key={`${p.name}-${i}`}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-3 ${
                    isFirst
                      ? 'border-2 border-gold bg-gold/10'
                      : 'border border-border bg-background/50'
                  }`}
                >
                  <span
                    className={`w-8 font-display text-sm font-black ${
                      isFirst ? 'text-gold' : 'text-muted-foreground'
                    }`}
                  >
                    {ordinal(place)}
                  </span>
                  <AvatarBadge styleId={p.avatar ?? 'masala'} name={p.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold leading-tight">{p.name}</p>
                  </div>
                  <span className="font-display text-lg font-black">
                    {p.score.toLocaleString()}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </main>
  )
}
