const STEPS = [
  {
    number: '01',
    title: 'Pick a Deck',
    body: 'Select from hundreds of fan-made Bollywood decks covering retro classics, modern blockbusters, and iconic soundtracks.',
  },
  {
    number: '02',
    title: 'Invite the Gang',
    body: 'Share your room code or QR code instantly. Friends join on mobile browsers as multiplayer avatar chips.',
  },
  {
    number: '03',
    title: 'Crown the King',
    body: 'Play real-time trivia together. Fastest finger gains bonus gold points. Clamber up the cinematic podium!',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-24 py-16 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.5rem]">
          How GatherFlix Works
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Start a party in three quick steps without downloading anything.
        </p>
      </div>

      <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
        {STEPS.map((step) => (
          <li
            key={step.number}
            className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-[0_20px_50px_-32px_rgb(0_0_0/0.4)] lg:p-9"
          >
            <span className="font-display text-4xl font-extrabold tracking-tight text-brand lg:text-[2.75rem]">
              {step.number}
            </span>
            <h3 className="mt-7 font-display text-xl font-bold tracking-tight">{step.title}</h3>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
