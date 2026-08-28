'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { MobileShell } from '@/components/mobile-shell'
import { AvatarBadge } from '@/components/join/avatar-badge'
import { AVATAR_STYLES } from '@/components/join/avatars'

function NicknameContent() {
  const router = useRouter()
  const params = useSearchParams()
  const code = params.get('code') ?? ''

  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState(AVATAR_STYLES[0].id)

  const canContinue = nickname.trim().length >= 2

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canContinue) return
    const query = new URLSearchParams({ code, name: nickname.trim(), avatar })
    router.push(`/join/lobby?${query.toString()}`)
  }

  return (
    <MobileShell>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-center gap-8 py-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-[2.75rem] font-extrabold leading-none text-foreground text-balance">
            Pick Your Nickname
          </h1>
          <p className="text-[0.95rem] text-muted-foreground text-pretty">
            This is how the gang will see you on the leaderboard
          </p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <AvatarBadge styleId={avatar} name={nickname} size={96} />

          <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Choose an avatar color">
            {AVATAR_STYLES.map((style) => {
              const selected = style.id === avatar
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setAvatar(style.id)}
                  aria-label={style.label}
                  aria-pressed={selected}
                  className="h-10 w-10 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: style.gradient,
                    outline: selected ? `2px solid ${style.ring}` : '2px solid transparent',
                    outlineOffset: 3,
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nickname" className="font-display text-sm font-semibold text-muted-foreground">
            Nickname
          </label>
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 16))}
            autoFocus
            placeholder="ShahRukhFan"
            className="rounded-2xl border-2 border-border bg-black/30 px-5 py-4 text-center font-display text-2xl font-bold text-foreground caret-brand outline-none transition-all placeholder:text-muted-foreground/50 focus:border-brand focus:shadow-[0_0_22px_rgba(236,27,120,0.4)]"
          />
        </div>

        <button
          type="submit"
          disabled={!canContinue}
          className="inline-flex items-center justify-center rounded-full bg-gold py-4 font-display text-lg font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          Join the Party
        </button>
      </form>
    </MobileShell>
  )
}

export default function NicknamePage() {
  return (
    <Suspense fallback={null}>
      <NicknameContent />
    </Suspense>
  )
}
