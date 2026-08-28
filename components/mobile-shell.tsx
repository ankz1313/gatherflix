import type { ReactNode } from 'react'
import { GatherflixLogo } from '@/components/gatherflix-logo'

export function MobileShell({
  children,
  showLogo = true,
}: {
  children: ReactNode
  showLogo?: boolean
}) {
  return (
    <main className="flex min-h-[100dvh] justify-center">
      <div className="flex w-full max-w-[420px] flex-col px-6 pb-10">
        {showLogo && (
          <div className="flex justify-center pt-10">
            <GatherflixLogo />
          </div>
        )}
        {children}
      </div>
    </main>
  )
}
