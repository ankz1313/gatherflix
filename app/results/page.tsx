import type { Metadata } from 'next'
import { TvPodium } from '@/components/game/tv-podium'

export const metadata: Metadata = {
  title: 'Final Results · GatherFlix',
  description: 'The final leaderboard and podium for your Trivia Night battle.',
}

export default function ResultsPage() {
  return <TvPodium />
}
