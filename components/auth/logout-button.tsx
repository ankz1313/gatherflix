'use client'

import { useState } from 'react'
import { signOutAction } from '@/app/auth/actions'
import { clearBrowserAuthCookies } from '@/lib/supabase/auth-cookies'

export function LogoutButton({ className }: { className?: string }) {
  const [busy, setBusy] = useState(false)

  async function handleLogout() {
    setBusy(true)
    clearBrowserAuthCookies()
    try {
      await signOutAction()
    } catch (error) {
      const digest =
        typeof error === 'object' && error && 'digest' in error
          ? String((error as { digest?: string }).digest)
          : ''
      if (digest.startsWith('NEXT_REDIRECT')) throw error
      window.location.assign('/')
    }
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
