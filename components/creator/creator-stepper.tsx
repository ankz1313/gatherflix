import { CREATOR_STEPS } from '@/lib/creator'

export function CreatorStepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {CREATOR_STEPS.map((step, i) => {
        const active = step.n === current
        const done = step.n < current
        return (
          <li key={step.n} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`grid size-8 place-items-center rounded-full font-display text-sm font-black transition-colors ${
                  active
                    ? 'bg-gold text-gold-foreground'
                    : done
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-secondary text-muted-foreground'
                }`}
              >
                {step.n}
              </span>
              <span
                className={`font-display text-sm font-bold ${
                  active ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < CREATOR_STEPS.length - 1 && (
              <span className="h-px w-6 bg-border sm:w-12" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
