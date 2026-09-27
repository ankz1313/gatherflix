import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { confirmEmail } from './actions'

export const metadata: Metadata = {
  title: 'Confirm · GatherFlix',
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>
}) {
  const { token_hash, type, next } = await searchParams
  if (!token_hash || !type) {
    redirect('/auth/error')
  }

  const isRecovery = type === 'recovery'

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
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <div className="scale-125">
          <GatherflixLogo />
        </div>
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl backdrop-blur-sm">
          <h1 className="font-display text-2xl font-extrabold text-foreground">
            {isRecovery ? 'Reset your password' : 'Confirm your email'}
          </h1>
          <p className="mt-3 text-[0.95rem] text-muted-foreground text-pretty">
            {isRecovery
              ? 'Tap below to choose a new GatherFlix password.'
              : 'Tap below to finish creating your GatherFlix account.'}
          </p>
          <form action={confirmEmail}>
            <input type="hidden" name="token_hash" value={token_hash} />
            <input type="hidden" name="type" value={type} />
            <input
              type="hidden"
              name="next"
              value={
                next && next.startsWith('/')
                  ? next
                  : isRecovery
                    ? '/auth/update-password'
                    : '/'
              }
            />
            <button
              type="submit"
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-gold font-display font-bold text-gold-foreground transition-transform hover:scale-[1.01]"
            >
              {isRecovery ? 'Continue' : 'Confirm email address'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
