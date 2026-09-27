'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { EmailOtpType } from '@supabase/supabase-js'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { createClient } from '@/lib/supabase/client'

const MIN_PASSWORD = 6

const OTP_TYPES: EmailOtpType[] = [
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]

const inputClass =
  'h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const supabase = createClient()
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const tokenHash = url.searchParams.get('token_hash')
      const typeParam = url.searchParams.get('type')

      const {
        data: { session: existing },
      } = await supabase.auth.getSession()

      if (!existing && code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        url.searchParams.delete('code')
        window.history.replaceState({}, '', `${url.pathname}${url.search}`)
        if (exchangeError) {
          if (!cancelled) {
            setError('Your reset link has expired. Please request a new one.')
            setReady(true)
          }
          return
        }
      } else if (!existing && tokenHash && typeParam && OTP_TYPES.includes(typeParam as EmailOtpType)) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          type: typeParam as EmailOtpType,
          token_hash: tokenHash,
        })
        url.searchParams.delete('token_hash')
        url.searchParams.delete('type')
        window.history.replaceState({}, '', `${url.pathname}${url.search}`)
        if (otpError) {
          if (!cancelled) {
            setError('Your reset link has expired. Please request a new one.')
            setReady(true)
          }
          return
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (cancelled) return
      setHasSession(Boolean(session))
      if (!session) {
        setError('Your reset link has expired. Please request a new one.')
      }
      setReady(true)
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    const supabase = createClient()
    setSubmitting(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(
          updateError.message.toLowerCase().includes('session')
            ? 'Your reset link has expired. Please request a new one.'
            : updateError.message,
        )
        return
      }
      router.push('/create')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 50% 0%, var(--brand-soft) 0%, transparent 55%)',
        }}
      />
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="scale-125">
          <GatherflixLogo />
        </div>
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm sm:p-7">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Set a new password
          </h1>
          {!ready ? (
            <p className="mt-6 text-sm text-muted-foreground">Opening your reset link…</p>
          ) : (
            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="new-password" className="sr-only">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className={inputClass}
                  required
                  disabled={!hasSession}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  className={inputClass}
                  required
                  disabled={!hasSession}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-brand"
                >
                  {error}{' '}
                  <Link href="/login" className="font-display font-bold underline underline-offset-2">
                    Request a new link
                  </Link>
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !hasSession}
                className="mt-2 h-14 w-full rounded-full bg-gold font-display text-lg font-bold text-gold-foreground shadow-[0_0_35px_-5px_var(--gold)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Please wait…' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
