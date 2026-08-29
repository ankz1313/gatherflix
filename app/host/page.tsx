import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { AppTopbar } from '@/components/app-topbar'
import { DECKS, difficultyClass } from '@/lib/decks'

export const metadata: Metadata = {
  title: 'Host a Room · Choose a Quiz — GatherFlix',
  description: 'Pick a Bollywood trivia deck to host your game night.',
}

export default function HostChooseQuizPage() {
  return (
    <>
      <AppTopbar
        steps={[
          { label: 'Choose Quiz', state: 'active' },
          { label: 'Preview', state: 'todo' },
          { label: 'Go Live', state: 'todo' },
        ]}
      />

      <main className="container-page py-10 lg:py-14">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand">
            Host / Create Room
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance lg:text-5xl">
            Choose a quiz to get the party started
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            Pick a deck below. You&apos;ll preview the questions before your friends join.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DECKS.map((deck) => (
            <li key={deck.slug}>
              <Link
                href={`/host/preview?deck=${deck.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_50px_-32px_rgb(0_0_0/0.5)] transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={deck.image}
                    alt={deck.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 font-display text-xs font-bold ${difficultyClass(deck.difficulty)}`}>
                      {deck.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">{deck.questionCount} questions</span>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-bold tracking-tight">{deck.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{deck.blurb}</p>

                  <span className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 font-display text-sm font-bold text-gold-foreground transition-transform group-hover:scale-[1.02]">
                    Preview &amp; Host
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
