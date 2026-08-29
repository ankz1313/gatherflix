import Image from 'next/image'
import { getFeaturedDecks } from '@/lib/decks'

export function FeaturedDecks() {
  const decks = getFeaturedDecks(4)

  return (
    <section id="featured-decks" className="container-page scroll-mt-24 py-16 lg:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.5rem]">
            Featured Movie Decks
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Voted best for group game nights this week
          </p>
        </div>

        <a
          href="/library"
          className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-border bg-secondary px-7 py-3.5 font-display text-[0.95rem] font-bold text-foreground transition-colors hover:bg-accent sm:self-auto"
        >
          View All Decks
        </a>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
        {decks.map((deck) => (
          <li key={deck.slug}>
            <a
              href={`/host/preview?deck=${deck.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_-32px_rgb(0_0_0/0.4)] transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={deck.image}
                  alt={deck.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold tracking-tight">{deck.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{deck.blurb}</p>

                <div className="mt-5 flex items-center gap-3">
                  <span className="rounded-full bg-brand-soft px-3 py-1 font-display text-xs font-bold text-brand">
                    {deck.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">{deck.questionCount} questions</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
