'use client'

import { Clapperboard, Crown, Film, Music, Popcorn, Sparkles, Star, Ticket } from 'lucide-react'

export const AVATARS = [
  { id: 'clapper', label: 'Clapperboard', Icon: Clapperboard },
  { id: 'film', label: 'Film reel', Icon: Film },
  { id: 'star', label: 'Star', Icon: Star },
  { id: 'ticket', label: 'Ticket', Icon: Ticket },
  { id: 'popcorn', label: 'Popcorn', Icon: Popcorn },
  { id: 'music', label: 'Music note', Icon: Music },
  { id: 'crown', label: 'Crown', Icon: Crown },
  { id: 'sparkles', label: 'Sparkles', Icon: Sparkles },
] as const

export type AvatarId = (typeof AVATARS)[number]['id']

export function avatarById(id: AvatarId) {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0]
}

type AvatarPickerProps = {
  value: AvatarId
  onChange: (next: AvatarId) => void
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Choose your avatar">
      {AVATARS.map(({ id, label, Icon }) => {
        const selected = id === value
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            onClick={() => onChange(id)}
            className={`flex size-12 items-center justify-center rounded-full border transition-colors ${
              selected
                ? 'border-gold bg-gold text-gold-foreground'
                : 'border-input bg-secondary/60 text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Icon className="size-[1.35rem]" strokeWidth={2.25} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
