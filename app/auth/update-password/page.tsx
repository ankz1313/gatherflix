'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { createClient } from '@/lib/supabase/client'

const MIN_PASSWORD = 6

const inputClass =
  'h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-brand"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 h-14 w-full rounded-full bg-gold font-display text-lg font-bold text-gold-foreground shadow-[0_0_35px_-5px_var(--gold)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Please wait…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
