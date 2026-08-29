import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AppTopbar } from '@/components/app-topbar'
import { getDeck, difficultyClass } from '@/lib/decks'

export const metadata: Metadata = {
  title: 'Host a Room · Quiz Preview — GatherFlix',
  description: 'Preview your chosen Bollywood trivia deck before going live.',
}

export default async function HostPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ deck?: string }>
}) {
  const { deck: slug } = await searchParams
  const deck = getDeck(slug)

  return (
    <>
      <AppTopbar
        steps={[
          { label: 'Choose Quiz', state: 'done' },
          { label: 'Preview', state: 'active' },
          { label: 'Go Live', state: 'todo' },
        ]}
      />

      <main className="container-page py-10 lg:py-14">
        <Link
          href="/host"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to all quizzes
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* Cover + meta */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative aspect-[16/9]">
              <Image
                src={deck.image}
                alt={deck.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 p-6">
              <span className={`rounded-full px-3 py-1 font-display text-xs font-bold ${difficultyClass(deck.difficulty)}`}>
                {deck.difficulty}
              </span>
              <span className="text-sm text-muted-foreground">{deck.questionCount} questions</span>
              <span className="text-sm text-muted-foreground">{deck.plays}</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-5xl">
              {deck.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Curated by {deck.host}</p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{deck.blurb}</p>

            <div className="mt-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Categories
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {deck.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-border bg-secondary px-4 py-1.5 font-display text-sm font-semibold"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Sample questions
              </h2>
              <ol className="mt-3 flex flex-col gap-3">
                {deck.sampleQuestions.map((q, i) => (
                  <li
                    key={q}
                    className="flex gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-sm font-extrabold text-brand">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{q}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/host/room?deck=${deck.slug}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 font-display text-base font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform hover:scale-[1.02]"
              >
                Create Room &amp; Go Live
              </Link>
              <Link
                href="/host"
                className="inline-flex items-center justify-center rounded-full border border-border bg-secondary px-8 py-4 font-display text-base font-bold text-foreground transition-colors hover:bg-accent"
              >
                Pick Another
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
