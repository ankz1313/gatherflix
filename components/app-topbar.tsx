import Link from 'next/link'
import { GatherflixLogo } from '@/components/gatherflix-logo'

type Step = { label: string; state: 'done' | 'active' | 'todo' }

export function AppTopbar({ steps }: { steps?: Step[] }) {
  return (
    <header className="border-b border-border/70 bg-background/70 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <GatherflixLogo />

        {steps && steps.length > 0 && (
          <ol className="hidden items-center gap-2 md:flex" aria-label="Host progress">
            {steps.map((step, i) => (
              <li key={step.label} className="flex items-center gap-2">
                <span
                  className={[
                    'inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-display text-xs font-bold',
                    step.state === 'active'
                      ? 'bg-gold text-gold-foreground'
                      : step.state === 'done'
                        ? 'bg-brand-soft text-brand'
                        : 'bg-secondary text-muted-foreground',
                  ].join(' ')}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-black/15 text-[0.7rem]">
                    {i + 1}
                  </span>
                  {step.label}
                </span>
                {i < steps.length - 1 && <span className="h-px w-5 bg-border" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        )}

        <Link
          href="/"
          className="rounded-full border border-border bg-secondary px-5 py-2 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent"
        >
          Exit
        </Link>
      </div>
    </header>
  )
}
