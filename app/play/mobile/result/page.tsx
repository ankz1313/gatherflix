import type { Metadata } from 'next'
import { MobileShell } from '@/components/mobile-shell'
import { MobileResult } from '@/components/game/mobile-result'

export const metadata: Metadata = {
  title: 'Result · GatherFlix',
  description: 'See how you scored on the last question.',
}

export default async function MobileResultPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams
  return (
    <MobileShell>
      <MobileResult code={code?.trim() ?? ''} />
    </MobileShell>
  )
}
