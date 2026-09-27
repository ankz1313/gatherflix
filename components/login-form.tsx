'use client'

import { useEffect, useState } from 'react'
import { signInWithPasswordAction } from '@/app/auth/actions'
import { friendlyAuthError } from '@/lib/auth-errors'
import { passwordResetRedirectTo, signupEmailRedirectTo } from '@/lib/auth-redirect'
import { clearBrowserAuthCookies } from '@/lib/supabase/auth-cookies'
import { createClient } from '@/lib/supabase/client'
import { trackLogin, trackSignup } from '@/lib/analytics'

type Mode = 'signin' | 'signup' | 'forgot'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 6 // Supabase default minimum

const inputClass =
  'h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]'

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.replace(redirectTarget())
      }
    })
  }, [])

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setNotice(null)
    setPassword('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)

    const cleanEmail = email.trim()
    if (!EMAIL_RE.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!isForgot && password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`)
      return
    }

    const supabase = createClient()
    setSubmitting(true)

    try {
      if (isForgot) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: passwordResetRedirectTo(),
        })
        if (resetError) {
          setError(friendlyAuthError(resetError.message))
          return
        }
        setNotice('Check your email for a link to reset your password.')
        return
      }

      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: signupEmailRedirectTo(),
            data: name.trim() ? { full_name: name.trim() } : undefined,
          },
        })
        if (signUpError) {
          setError(friendlyAuthError(signUpError.message))
          return
        }
        // Supabase obfuscates existing emails by returning a user with no
        // identities rather than an error.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('An account with this email already exists. Try signing in instead.')
          return
        }
        trackSignup()
        if (data.session) {
          window.location.assign(redirectTarget())
          return
        }
        setNotice('Account created! Check your email to confirm your address, then sign in.')
        return
      }

      clearBrowserAuthCookies()
      const result = await signInWithPasswordAction({
        email: cleanEmail,
        password,
        next: redirectTarget(),
      })
      if (result?.error) {
        setError(result.error)
        return
      }
      trackLogin()
    } catch (error) {
      const digest =
        typeof error === 'object' && error && 'digest' in error
          ? String((error as { digest?: string }).digest)
          : ''
      if (digest.startsWith('NEXT_REDIRECT')) throw error
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const heading = isForgot ? 'Reset Password' : isSignup ? 'Create Account' : 'Sign In'
  const cta = isForgot
    ? 'Send Reset Link'
    : isSignup
      ? 'Create Account & Play'
      : 'Sign In to Play'

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm sm:p-7">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
        {heading}
      </h1>

      {isForgot && (
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>
      )}

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {isSignup && (
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="sr-only">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              className={inputClass}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={inputClass}
            required
          />
        </div>

        {!isForgot && (
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={inputClass}
              required
            />
          </div>
        )}

        {mode === 'signin' && (
          <button
            type="button"
            onClick={() => switchMode('forgot')}
            className="-mt-1 self-end text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            Forgot password?
          </button>
        )}

        {error && (
          <p role="alert" className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-brand">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-14 w-full rounded-full bg-gold font-display text-lg font-bold text-gold-foreground shadow-[0_0_35px_-5px_var(--gold)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Please wait…' : cta}
        </button>
      </form>

      {isForgot ? (
        <p className="mt-7 text-center text-[0.95rem] text-muted-foreground">
          Remembered it?{' '}
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className="font-display font-bold text-gold transition-opacity hover:opacity-80"
          >
            Back to Sign In
          </button>
        </p>
      ) : (
        <p className="mt-7 text-center text-[0.95rem] text-muted-foreground">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? 'signin' : 'signup')}
            className="font-display font-bold text-gold transition-opacity hover:opacity-80"
          >
            {isSignup ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      )}

      <p className="mt-3 text-center text-sm text-muted-foreground/55">
        By signing in, you agree to trivia-night honor code.
      </p>
    </div>
  )
}

function redirectTarget() {
  const fromParam = new URLSearchParams(window.location.search).get('redirectedFrom')
  return fromParam && fromParam.startsWith('/') ? fromParam : '/create'
}
