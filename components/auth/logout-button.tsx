'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleLogout() {
    setBusy(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={busy}
      className={
        className ??
        'rounded-full border border-border bg-card px-4 py-2 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent disabled:opacity-60'
      }
    >
      {busy ? 'Signing out…' : 'Log out'}
    </button>
  )
}
