'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { MobileShell } from '@/components/mobile-shell'
import { RoomCodeInput } from '@/components/join/room-code-input'

function JoinEnterCodeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const preset = (params.get('code') ?? '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)

  const [code, setCode] = useState(preset)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const autoChecked = useRef(false)

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
        setError('This game has already started.')
        return
      }
      router.push(`/join/nickname?code=${encodeURIComponent(final)}`)
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    if (autoChecked.current || preset.length < 6) return
    autoChecked.current = true
    void validateAndContinue(preset)
    // Preset codes come from the host QR / shared link and should auto-enter.
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
            validateAndContinue(value)
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

        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-secondary/60 py-4 font-display text-lg font-bold text-foreground transition-colors hover:bg-accent"
        >
          <img src="/figma/camera.svg" alt="" aria-hidden="true" className="h-6 w-6" />
          Scan Host QR Code
        </button>
      </div>
    </MobileShell>
  )
}

export default function JoinEnterCodePage() {
  return (
    <Suspense fallback={null}>
      <JoinEnterCodeContent />
    </Suspense>
  )
}
