import type { Metadata } from 'next'
import { MobileShell } from '@/components/mobile-shell'
import { MobileFinal } from '@/components/game/mobile-final'

export const metadata: Metadata = {
  title: 'Your Final Score · GatherFlix',
  description: 'Your final placement in the movie-night trivia battle.',
}

export default function MobileFinalPage() {
  return (
    <MobileShell>
      <MobileFinal />
    </MobileShell>
  )
}
