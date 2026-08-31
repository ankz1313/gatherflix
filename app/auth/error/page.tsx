import type { Metadata } from 'next'
import Link from 'next/link'
import { GatherflixLogo } from '@/components/gatherflix-logo'

export const metadata: Metadata = {
  title: 'Authentication Error · GatherFlix',
}

export default function AuthErrorPage() {
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
            That link didn&apos;t work
          </h1>
          <p className="mt-3 text-[0.95rem] text-muted-foreground text-pretty">
            Your sign-in or reset link may have expired or already been used. Please request a new
            one and try again.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-gold font-display font-bold text-gold-foreground transition-transform hover:scale-[1.01]"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
