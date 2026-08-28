'use client'

import { Check, LogOut, Users } from 'lucide-react'
import { AVATARS, avatarById, type AvatarId } from '@/components/avatar-picker'

type RoomLobbyProps = {
  code: string
  name: string
  avatar: AvatarId
  onLeave: () => void
}

// Placeholder co-players until the realtime room backend exists.
const OTHER_PLAYERS = [
  { name: 'Rahul Khanna', avatar: 'crown' as AvatarId, host: true },
  { name: 'Meera J.', avatar: 'star' as AvatarId, host: false },
  { name: 'Dev Patel', avatar: 'music' as AvatarId, host: false },
  { name: 'Anjali', avatar: 'ticket' as AvatarId, host: false },
]

export function RoomLobby({ code, name, avatar, onLeave }: RoomLobbyProps) {
  const you = avatarById(avatar)
  const YourIcon = you.Icon
  const total = OTHER_PLAYERS.length + 1

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_70px_-30px_rgb(0_0_0/0.45)] sm:p-9">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-full bg-gold text-gold-foreground">
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        </span>
        <p className="font-display text-sm font-bold tracking-[0.06em] text-gold uppercase">You&apos;re in</p>
      </div>

      <h2 className="mt-5 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">Sholay Masala Night</h2>
      <p className="mt-2 text-[0.95rem] text-muted-foreground">
        Room{' '}
        <span className="font-display font-bold tracking-[0.12em] text-foreground">{code}</span> · Hosted by Rahul
        Khanna
      </p>

      <div className="mt-8 flex items-center gap-2 border-t border-border pt-7">
        <Users className="size-4 text-muted-foreground" strokeWidth={2.25} aria-hidden="true" />
        <span className="font-display text-sm font-bold tracking-tight">In the room ({total})</span>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        <li className="flex items-center gap-3.5 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground">
            <YourIcon className="size-[1.15rem]" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 truncate font-display text-[0.95rem] font-bold">{name}</span>
          <span className="shrink-0 font-display text-xs font-bold tracking-[0.06em] text-gold uppercase">You</span>
        </li>

        {OTHER_PLAYERS.map((player) => {
          const { Icon } = avatarById(player.avatar)
          return (
            <li
              key={player.name}
              className="flex items-center gap-3.5 rounded-2xl border border-border bg-secondary/50 px-4 py-3.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground">
                <Icon className="size-[1.15rem]" strokeWidth={2.25} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.95rem] text-foreground">{player.name}</span>
              {player.host && (
                <span className="shrink-0 font-display text-xs font-bold tracking-[0.06em] text-brand uppercase">
                  Host
                </span>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Waiting for the host to start the first round.</p>
        <button
          type="button"
          onClick={onLeave}
          className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-secondary/70 px-6 py-3 font-display text-[0.95rem] font-bold text-foreground transition-colors hover:bg-accent"
        >
          <LogOut className="size-4" strokeWidth={2.5} aria-hidden="true" />
          Leave room
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Joined room {code} as {name}. {total} players in the room.
      </p>

      {/* Keeps AVATARS referenced for the roster legend below. */}
      <span className="sr-only">{AVATARS.length} avatars available</span>
    </div>
  )
}
