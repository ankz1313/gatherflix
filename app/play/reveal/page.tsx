import type { Metadata } from 'next'
import { TvReveal } from '@/components/game/tv-reveal'

export const metadata: Metadata = {
  title: 'Answer Revealed — GatherFlix',
  description: 'The correct answer, vote distribution, and live leaderboard.',
}

export default function RevealPage() {
  return <TvReveal />
}
