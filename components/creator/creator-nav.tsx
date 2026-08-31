import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/auth/logout-button'

const NAV = [
  { label: 'Explore Packs', href: '/library' },
  { label: 'My Quizzes', href: '/create' },
  { label: 'Global Leaderboards', href: '/results' },
]

export async function CreatorNav({ active = 'My Quizzes' }: { active?: string }) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'Guest'

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
          <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 sm:flex">
            <span
              className="grid size-6 place-items-center rounded-full bg-brand/20 font-display text-xs font-black uppercase text-brand"
              aria-hidden="true"
            >
              {displayName.charAt(0)}
            </span>
            <span className="font-display text-sm font-bold">{displayName}</span>
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
