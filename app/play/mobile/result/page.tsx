import type { Metadata } from 'next'
import { MobileShell } from '@/components/mobile-shell'
import { MobileResult } from '@/components/game/mobile-result'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Result · GatherFlix',
  description: 'See how you scored on the last question.',
}

export default async function MobileResultPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; q?: string }>
}) {
  const { code, q } = await searchParams
  const questionIndex = Number.parseInt(q ?? '0', 10)
  return (
    <MobileShell>
      <MobileResult
        code={code?.trim() ?? ''}
        questionIndex={Number.isFinite(questionIndex) ? questionIndex : 0}
      />
    </MobileShell>
  )
}
