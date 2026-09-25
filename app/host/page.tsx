import type { Metadata } from 'next'
import { HostTopbar } from '@/components/host/host-topbar'
import { HostQuizGrid } from '@/components/host/host-quiz-grid'
import { getPublishedQuizzes } from '@/lib/quiz-data'

export const metadata: Metadata = {
  title: 'Host a Trivia Night — GatherFlix',
  description:
    'Pick a published trivia pack, share a room code or QR, and host a live movie, sports, or TV quiz with friends.',
  alternates: { canonical: '/host' },
}

export default async function HostChooseQuizPage() {
  const quizzes = await getPublishedQuizzes()

  return (
    <>
      <HostTopbar active="library" />

      <main className="container-page py-10 lg:py-12">
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-5xl">
          Choose Your Battleground
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Pick a published pack, share a code or QR, and host a live trivia night with your crew.
        </p>

        <HostQuizGrid quizzes={quizzes} />
      </main>
    </>
  )
}
