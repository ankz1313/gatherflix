import type { Metadata } from 'next'
import { MobileShell } from '@/components/mobile-shell'
import { MobileFinal } from '@/components/game/mobile-final'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your Final Score · GatherFlix',
  description: 'Your final placement in the Trivia Night battle.',
}

export default async function MobileFinalPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams
  return (
    <MobileShell>
      <MobileFinal code={code?.trim() ?? ''} />
    </MobileShell>
  )
}
