import type { Metadata } from 'next'
import { MobileShell } from '@/components/mobile-shell'
import { MobileAnswer } from '@/components/game/mobile-answer'

export const metadata: Metadata = {
  title: 'Your Answer · GatherFlix',
  description: 'Tap fast to lock in your answer and climb the leaderboard.',
}

export default function MobilePlayPage() {
  return (
    <MobileShell>
      <MobileAnswer />
    </MobileShell>
  )
}
