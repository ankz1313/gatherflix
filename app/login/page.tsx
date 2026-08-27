import type { Metadata } from 'next'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { LoginForm } from '@/components/login-form'

export const metadata: Metadata = {
  title: 'Sign In · GatherFlix',
  description: 'Sign in to host and join real-time Bollywood movie & shows trivia with friends.',
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* focused plum bloom behind the card, matching the Figma frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(120% 80% at 50% 0%, var(--brand-soft) 0%, transparent 55%)',
        }}
      />

      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="scale-125">
            <GatherflixLogo />
          </div>
          <p className="text-[0.95rem] text-muted-foreground">
            The ultimate Bollywood game night awaits
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}
