import type { Metadata } from 'next'
import { HostTopbar } from '@/components/host/host-topbar'
import { HostQuizGrid } from '@/components/host/host-quiz-grid'

export const metadata: Metadata = {
  title: 'Host a Room · Choose Your Battleground — GatherFlix',
  description: 'Pick a curated Bollywood trivia deck to host your game night.',
}

export default function HostChooseQuizPage() {
  return (
    <>
      <HostTopbar active="library" />

      <main className="container-page py-10 lg:py-12">
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-5xl">
          Choose Your Battleground
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Select a curated movie deck to host. Invite your friends, face-off real time, and award
          the Bollywood crown.
        </p>

        <HostQuizGrid />
      </main>
    </>
  )
}
