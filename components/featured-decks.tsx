import Image from 'next/image'
import { unstable_noStore as noStore } from 'next/cache'
import { DECKS } from '@/lib/decks'
import { getMostPlayedPublishedQuizzes } from '@/lib/quiz-data'

const FALLBACK_IMAGE = '/decks/deck-classic-90s-romance.png'

function coverFor(title: string, coverImageUrl: string | null): string {
  if (coverImageUrl?.trim()) return coverImageUrl
  return DECKS.find((d) => d.title === title)?.image ?? FALLBACK_IMAGE
}

export async function FeaturedDecks() {
  noStore()
  const decks = await getMostPlayedPublishedQuizzes(4)
  if (decks.length === 0) return null

  return (
    <section id="featured-decks" className="container-page scroll-mt-24 py-10 lg:py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.5rem]">
            Featured Trivia Packs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The packs crews have hosted the most
          </p>
        </div>

        <a
          href="/library"
          className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-border bg-secondary px-7 py-3.5 font-display text-[0.95rem] font-bold text-foreground transition-colors hover:bg-accent sm:self-auto"
        >
          View All Decks
        </a>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
        {decks.map((deck) => (
          <li key={deck.id}>
            <a
              href={`/host/preview?quiz=${deck.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_-32px_rgb(0_0_0/0.4)] transition-transform hover:-translate-y-1"
            >
              <div className="flex min-h-[11rem] items-center justify-center bg-secondary px-4 py-5">
                <Image
                  src={coverFor(deck.title, deck.coverImageUrl)}
                  alt={deck.title}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-auto max-h-44 w-auto max-w-full object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold tracking-tight">{deck.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {deck.description ?? ''}
                </p>

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
