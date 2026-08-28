'use client'

import { useState } from 'react'

export function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const isSignup = mode === 'signup'

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm sm:p-7">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
        {isSignup ? 'Create Account' : 'Sign In'}
      </h1>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
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
              placeholder="Amitabh Bachchan"
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]"
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
            placeholder="amitabh@bachchan.com"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            placeholder="••••••••••••"
            className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]"
          />
        </div>

        <button
          type="submit"
          className="mt-2 h-14 w-full rounded-full bg-gold font-display text-lg font-bold text-gold-foreground shadow-[0_0_35px_-5px_var(--gold)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {isSignup ? 'Create Account & Play' : 'Sign In to Play'}
        </button>
      </form>

      <p className="mt-7 text-center text-[0.95rem] text-muted-foreground">
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <button
          type="button"
          onClick={() => setMode(isSignup ? 'signin' : 'signup')}
          className="font-display font-bold text-gold transition-opacity hover:opacity-80"
        >
          {isSignup ? 'Sign In' : 'Create Account'}
        </button>
      </p>

      <p className="mt-3 text-center text-sm text-muted-foreground/55">
        By signing in, you agree to movie-night honor code.
      </p>
    </div>
  )
}
