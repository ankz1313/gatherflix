import Link from 'next/link'
import { GatherflixLogo } from '@/components/gatherflix-logo'

export function HostTopbar({ active = 'library' }: { active?: 'library' | 'custom' }) {
  return (
    <header className="border-b border-border/60">
      <div className="container-page flex items-center justify-between py-5">
        <div className="flex items-center gap-3">
          <GatherflixLogo />
          <span className="rounded-full bg-brand px-3 py-1 font-display text-[0.7rem] font-bold uppercase tracking-wide text-brand-foreground">
            Host Mode
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/host"
            className={`font-display text-sm font-bold ${
              active === 'library'
                ? 'text-brand underline decoration-2 underline-offset-8'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Quiz Library
          </Link>
          <Link
            href="/create"
            className={`font-display text-sm font-bold ${
              active === 'custom'
                ? 'text-brand underline decoration-2 underline-offset-8'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Custom Decks
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <span className="hidden font-display text-sm font-bold sm:inline">Karan Johar</span>
          <span
            className="grid size-9 place-items-center rounded-full bg-secondary text-lg"
            aria-hidden="true"
          >
            {'\u{1F37F}'}
          </span>
        </div>
      </div>
    </header>
  )
}
