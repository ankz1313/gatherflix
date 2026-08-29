import type { Metadata } from 'next'
import { TvQuestion } from '@/components/game/tv-question'

export const metadata: Metadata = {
  title: 'Live Question — GatherFlix',
  description: 'The live game question screen for the big screen.',
}

export default function PlayPage() {
  return <TvQuestion />
}
