import Link from 'next/link'

const NAV = [
  { label: 'Explore Packs', href: '/library' },
  { label: 'My Quizzes', href: '/create' },
  { label: 'Global Leaderboards', href: '/results' },
]

export function CreatorNav({ active = 'My Quizzes' }: { active?: string }) {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-brand font-display text-lg font-black text-brand-foreground">
              G
            </span>
            <span className="font-display text-xl font-black tracking-tight">
              GATHER<span className="text-gold">FLIX</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-display text-[0.95rem] font-bold transition-colors ${
                  active === item.label
                    ? 'text-brand'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <span className="text-base" aria-hidden="true">
              {'\u{1F37F}'}
            </span>
            <span className="font-display text-sm font-bold">ShahRukhFan</span>
            <span className="font-display text-xs font-black text-gold">1,200 XP</span>
          </span>
          <span
            className="grid size-9 place-items-center rounded-full border border-border bg-card"
            aria-hidden="true"
          >
            <span className="size-1.5 rounded-full bg-muted-foreground" />
          </span>
        </div>
      </div>
    </header>
  )
}
