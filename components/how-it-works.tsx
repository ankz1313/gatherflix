const STEPS = [
  {
    number: '01',
    title: 'Pick a Deck',
    body: 'Pick a Bollywood, cricket, or TV pack from the library — we add new quizzes as we grow.',
  },
  {
    number: '02',
    title: 'Invite Your Crew',
    body: 'Share your room code or QR — friends join instantly on their phones, no app needed.',
  },
  {
    number: '03',
    title: 'Play & Win',
    body: 'Answer live, score points for speed, and climb the leaderboard together.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-24 py-10 lg:py-12">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.5rem]">
          How GatherFlix Works
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Start a party in three quick steps without downloading anything.
        </p>
      </div>

      <ol className="mt-8 grid gap-5 md:grid-cols-3 lg:mt-10 lg:gap-6">
        {STEPS.map((step) => (
          <li
            key={step.number}
            className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_20px_50px_-32px_rgb(0_0_0/0.4)] lg:p-7"
          >
            <span className="font-display text-4xl font-extrabold tracking-tight text-brand lg:text-[2.5rem]">
              {step.number}
            </span>
            <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{step.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
