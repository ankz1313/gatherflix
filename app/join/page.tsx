'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { JoinEnterCode } from '@/components/join/join-enter-code'

function JoinFromQuery() {
  const params = useSearchParams()
  const preset = (params.get('code') ?? '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)
  return <JoinEnterCode key={preset || 'manual'} presetCode={preset} />
}

export default function JoinEnterCodePage() {
  return (
    <Suspense fallback={null}>
      <JoinFromQuery />
    </Suspense>
  )
}
