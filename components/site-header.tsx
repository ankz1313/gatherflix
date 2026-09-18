'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { GatherflixLogo } from '@/components/gatherflix-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/auth/user-menu'

const NAV_LINKS = [
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'Trending Packs', href: '/library' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
      <p className="border-b border-gold/25 bg-gold/10 px-4 py-2.5 text-center text-[0.8rem] leading-snug text-gold sm:text-sm">
        Work in progress — GatherFlix is in early access. Look around, play a round, and expect a few things to still be in flux.
      </p>
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <GatherflixLogo />

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <ThemeToggle />

          <div className="hidden md:block">
            <UserMenu />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-foreground md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="container-page flex flex-col gap-1 border-t border-border pb-5 pt-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2" onClick={() => setOpen(false)}>
            <UserMenu className="block rounded-full border border-border bg-secondary px-6 py-3 text-center font-display font-bold text-foreground" />
          </div>
        </nav>
      )}
    </header>
  )
}
