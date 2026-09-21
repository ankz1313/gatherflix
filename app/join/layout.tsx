import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join a Trivia Night · GatherFlix',
  description:
    'Enter a six-character room code to join a live GatherFlix trivia night on your phone. No app download.',
  alternates: { canonical: '/join' },
}

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children
}
