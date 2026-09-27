'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MobileShell } from '@/components/mobile-shell'
import { RoomCodeInput } from '@/components/join/room-code-input'

export function JoinEnterCode({ presetCode = '' }: { presetCode?: string }) {
  const router = useRouter()
  const preset = presetCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)

  const [code, setCode] = useState(preset)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function validateAndContinue(value?: string) {
    const final = (value ?? code).replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    if (final.length < 6) return
    setChecking(true)
    setError(null)
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(final)}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setError('No room found with that code. Double-check and try again.')
        return
      }
      if (data.room.status !== 'lobby') {
        const token = sessionStorage.getItem(`gf_player_token_${final}`)
        if (token) {
          router.replace(`/play/mobile?code=${encodeURIComponent(final)}`)
          return
        }
        setError('This room already started. Scan the new QR on the host screen.')
        return
      }
      router.replace(`/join/nickname?code=${encodeURIComponent(final)}`)
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    setCode(preset)
    if (preset.length < 6) return
    void validateAndContinue(preset)
    // Re-run whenever the scanned code changes (new game QR).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset])

  useEffect(() => {
    function onShow(event: PageTransitionEvent) {
      if (event.persisted && preset.length === 6) {
        void validateAndContinue(preset)
      }
    }
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset])

  return (
    <MobileShell>
      <div className="flex flex-1 flex-col justify-center gap-8 py-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-[2.75rem] font-extrabold leading-none text-foreground text-balance">
            Enter Room Code
          </h1>
          <p className="text-[0.95rem] text-muted-foreground text-pretty">
            Join the live trivia session hosted by your gang
          </p>
        </div>

        <RoomCodeInput
          initialCode={preset}
          onComplete={(value) => {
            setCode(value)
            void validateAndContinue(value)
          }}
        />

        {checking && (
          <p className="text-center text-sm text-muted-foreground" role="status">
            Checking room code…
          </p>
        )}
        {error && (
          <p className="text-center text-sm font-semibold text-brand" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Or scan a QR code
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground text-pretty">
          Open your phone&apos;s Camera app and point it at the QR on the host screen.
        </p>
      </div>
    </MobileShell>
  )
}
