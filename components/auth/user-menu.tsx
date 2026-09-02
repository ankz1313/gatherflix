'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, LayoutGrid, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UserMenuProps = {
  /** Optional extra classes for the trigger/login button. */
  className?: string
}

function nameFromUser(user: {
  email?: string
  user_metadata?: { full_name?: string }
} | null): string | null {
  if (!user) return null
  return (
    user.user_metadata?.full_name?.trim() ||
    user.email?.split('@')[0] ||
    'Account'
  )
}

export function UserMenu({ className }: UserMenuProps) {
  const router = useRouter()
  const [name, setName] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setName(nameFromUser(data.user))
      setReady(true)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setName(nameFromUser(session?.user ?? null))
      setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function handleSignOut() {
    setBusy(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  // Avoid a flash of the wrong state before auth resolves.
  if (!ready) {
    return <span className="h-10 w-24" aria-hidden="true" />
  }

  if (!name) {
    return (
      <a
        href="/login"
        className={
          className ??
          'rounded-full border border-border bg-secondary px-6 py-2.5 font-display text-[0.95rem] font-bold text-foreground transition-colors hover:bg-accent'
        }
      >
        Login
      </a>
    )
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border bg-secondary py-2 pl-2 pr-3 font-display text-[0.95rem] font-bold text-foreground transition-colors hover:bg-accent"
      >
        <span
          className="grid size-6 place-items-center rounded-full bg-brand/20 font-display text-xs font-black uppercase text-brand"
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
        <span className="max-w-[10rem] truncate">{name}</span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-52 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl"
        >
          <a
            href="/create"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <LayoutGrid className="size-4 text-muted-foreground" aria-hidden="true" />
            My Quizzes
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={busy}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-60"
          >
            <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  )
}
