import { Clapperboard, Play, Plus } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="container-page pt-12 pb-16 lg:pt-24 lg:pb-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy column */}
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2">
            <Clapperboard className="size-4 text-brand" strokeWidth={2.5} aria-hidden="true" />
            <span className="font-display text-[0.7rem] font-bold tracking-[0.08em] text-brand uppercase sm:text-xs">
              Trivia nights, reimagined
            </span>
          </span>

          <h1 className="mt-7 font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]">
            Face off with friends in real-time <span className="text-gold">Movie and Shows Trivia!</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            No corporate quiz boards here. Just high-energy masala, legendary dialogs, and midnight movie debates. Free
            forever, right on your phones.
          </p>

          <div className="mt-9 flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <a
              href="/join"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 font-display text-base font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform hover:scale-[1.02]"
            >
              <Play className="size-[1.15rem] fill-current" strokeWidth={0} aria-hidden="true" />
              Join a Game
            </a>

            <a
              href="/host"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-secondary/70 px-8 py-4 font-display text-base font-bold text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="size-[1.15rem]" strokeWidth={2.5} aria-hidden="true" />
              Host / Create Room
            </a>
          </div>
        </div>

        {/* Featured room card */}
        <div className="rounded-3xl border border-border bg-card p-3.5 shadow-[0_24px_70px_-30px_rgb(0_0_0/0.45)] sm:p-4">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/decks/hero-sholay-masala-night.png"
              alt="Dancers in embroidered outfits performing on an ornate Bollywood theatre stage under spotlights"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div className="px-1.5 pt-5 pb-2">
            <h2 className="font-display text-xl font-bold tracking-tight sm:text-[1.35rem]">Sholay Masala Night</h2>
            <p className="mt-1.5 text-[0.95rem] text-muted-foreground">Hosted by Rahul Khanna</p>
          </div>
        </div>
      </div>
    </section>
  )
}
