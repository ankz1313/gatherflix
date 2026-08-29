'use client'

import Link from 'next/link'
import { AvatarBadge } from '@/components/join/avatar-badge'
import { FINAL_RESULTS, GAME_SUMMARY } from '@/lib/game'

// Podium order: 2nd, 1st, 3rd so the winner sits center and tallest.
const PODIUM = [
  { player: FINAL_RESULTS[1], place: 2, height: 'h-40', accent: 'var(--muted-foreground)' },
  { player: FINAL_RESULTS[0], place: 1, height: 'h-56', accent: 'var(--gold)' },
  { player: FINAL_RESULTS[2], place: 3, height: 'h-28', accent: 'var(--brand)' },
]

export function TvPodium() {
  const rest = FINAL_RESULTS.slice(3)

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col px-6 py-10">
      {/* Header */}
      <div className="text-center">
        <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-brand">
          Game Over
        </p>
        <h1 className="mt-2 font-display text-5xl font-black text-balance">
          The Final Curtain Call
        </h1>
        <p className="mt-3 text-muted-foreground">
          {GAME_SUMMARY.deckTitle} · {GAME_SUMMARY.totalQuestions} questions ·{' '}
          {GAME_SUMMARY.playerCount} players
        </p>
      </div>

      {/* Podium */}
      <div className="mt-12 flex items-end justify-center gap-4 sm:gap-8">
        {PODIUM.map(({ player, place, height, accent }) => (
          <div key={place} className="flex w-28 flex-col items-center sm:w-40">
            <AvatarBadge
              name={player.name}
              styleId={player.styleId}
              size={place === 1 ? 88 : 64}
            />
            <p className="mt-3 font-display text-lg font-extrabold">{player.name}</p>
            <p className="font-display text-sm font-bold text-gold">
              {player.score.toLocaleString()}
            </p>
            <div
              className={`mt-3 flex w-full ${height} items-start justify-center rounded-t-2xl border-t-4 pt-4`}
              style={{
                borderColor: accent,
                background:
                  'linear-gradient(180deg, color-mix(in oklab, var(--card) 92%, transparent), var(--card))',
              }}
            >
              <span className="font-display text-4xl font-black" style={{ color: accent }}>
                {place}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Runners up */}
      {rest.length > 0 && (
        <div className="mx-auto mt-10 w-full max-w-2xl space-y-2">
          {rest.map((player, i) => (
            <div
              key={player.name}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-3"
            >
              <span className="w-6 font-display text-lg font-black text-muted-foreground">
                {i + 4}
              </span>
              <AvatarBadge name={player.name} styleId={player.styleId} size={40} />
              <span className="flex-1 font-display font-bold">{player.name}</span>
              <span className="text-sm text-muted-foreground">{player.correct} correct</span>
              <span className="font-display font-bold text-gold">
                {player.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/host"
          className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 font-display text-base font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform hover:scale-[1.02]"
        >
          Play Again
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border bg-secondary/70 px-8 py-4 font-display text-base font-bold text-foreground transition-colors hover:bg-accent"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
