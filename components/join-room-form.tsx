'use client'

import { ArrowRight, Loader2, LogIn, ScanLine } from 'lucide-react'
import { useState } from 'react'
import { AvatarPicker, type AvatarId } from '@/components/avatar-picker'
import { RoomLobby } from '@/components/room-lobby'
import { RoomCodeInput } from '@/components/room-code-input'

type Status = 'idle' | 'joining' | 'joined'

export function JoinRoomForm() {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<AvatarId>('clapper')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (code.length < 6) {
      setError('Enter all 6 characters of the room code.')
      return
    }
    if (!name.trim()) {
      setError('Add a display name so the gang knows who you are.')
      return
    }

    setError(null)
    setStatus('joining')
    // No backend yet — this simulates the handshake so the lobby state is reviewable.
    window.setTimeout(() => setStatus('joined'), 1100)
  }

  if (status === 'joined') {
    return (
      <RoomLobby
        code={code}
        name={name.trim()}
        avatar={avatar}
        onLeave={() => {
          setStatus('idle')
          setError(null)
        }}
      />
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-border bg-card p-6 shadow-[0_24px_70px_-30px_rgb(0_0_0/0.45)] sm:p-9"
    >
      <fieldset className="border-0 p-0" disabled={status === 'joining'}>
        <legend className="sr-only">Join a game room</legend>

        <label htmlFor="room-code-hint" className="font-display text-sm font-bold tracking-tight">
          Room code
        </label>
        <p id="room-code-hint" className="mt-1.5 text-sm text-muted-foreground">
          Ask the host for the 6-character code, or scan their QR.
        </p>
        <div className="mt-4">
          <RoomCodeInput value={code} onChange={setCode} invalid={Boolean(error) && code.length < 6} />
        </div>

        <div className="mt-8">
          <label htmlFor="display-name" className="font-display text-sm font-bold tracking-tight">
            Display name
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={18}
            autoComplete="nickname"
            placeholder="Pinky from Andheri"
            aria-invalid={Boolean(error) && !name.trim() ? true : undefined}
            className={`mt-3 h-14 w-full rounded-2xl border bg-secondary/60 px-5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-gold/40 ${
              Boolean(error) && !name.trim() ? 'border-destructive' : 'border-input'
            }`}
          />
        </div>

        <div className="mt-8">
          <span className="font-display text-sm font-bold tracking-tight">Pick your avatar</span>
          <div className="mt-3">
            <AvatarPicker value={avatar} onChange={setAvatar} />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-6 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 font-display text-base font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {status === 'joining' ? (
              <>
                <Loader2 className="size-[1.15rem] animate-spin" aria-hidden="true" />
                Joining room
              </>
            ) : (
              <>
                <LogIn className="size-[1.15rem]" strokeWidth={2.5} aria-hidden="true" />
                Join the room
              </>
            )}
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-secondary/70 px-8 py-4 font-display text-base font-bold text-foreground transition-colors hover:bg-accent"
          >
            <ScanLine className="size-[1.15rem]" strokeWidth={2.5} aria-hidden="true" />
            Scan QR instead
          </button>
        </div>

        <p className="mt-7 border-t border-border pt-6 text-sm text-muted-foreground">
          Hosting instead?{' '}
          <a href="/#host" className="inline-flex items-center gap-1 font-semibold text-gold hover:underline">
            Create a room
            <ArrowRight className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
          </a>
        </p>
      </fieldset>
    </form>
  )
}
