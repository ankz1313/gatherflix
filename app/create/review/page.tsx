import type { Metadata } from 'next'
import Link from 'next/link'
import { CreatorNav } from '@/components/creator/creator-nav'
import { DRAFT_QUESTIONS, REVIEW_STATS } from '@/lib/creator'

export const metadata: Metadata = {
  title: 'Review & Publish · GatherFlix',
  description: 'Give your quiz a final look before sharing it with the world.',
}

export default function ReviewStepPage() {
  return (
    <div className="min-h-[100dvh]">
      <CreatorNav active="My Quizzes" />
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[320px_1fr]">
        {/* Left rail */}
        <aside>
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-black uppercase tracking-wide text-brand">
              Step 3 of 3
            </span>
            <span className="font-display text-sm font-bold">Review &amp; Publish</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-full rounded-full bg-brand" />
          </div>

          {/* Stats card */}
          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="font-display text-xl font-black">Quick Trivia Stats</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md bg-gold-soft px-3 py-1 font-display text-xs font-bold uppercase text-gold">
                {REVIEW_STATS.difficulty}
              </span>
              <span className="rounded-md bg-brand-soft px-3 py-1 font-display text-xs font-bold text-brand">
                {REVIEW_STATS.tag}
              </span>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total Questions</dt>
                <dd className="font-display font-bold">{REVIEW_STATS.totalQuestions} Questions</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Lobby Duration</dt>
                <dd className="font-display font-bold">{REVIEW_STATS.duration}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Max Lvl Potential</dt>
                <dd className="font-display font-bold text-gold">{REVIEW_STATS.maxXp}</dd>
              </div>
            </dl>
          </div>

          {/* Going live note */}
          <div className="mt-4 rounded-2xl border border-brand/50 bg-brand/5 p-5">
            <p className="flex items-center gap-2 font-display font-bold">
              <span aria-hidden="true">{'\u{1F4E3}'}</span> Going Live soon!
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once published, this pack joins the GatherFlix public library. Anyone can host it in
              their live social watch-parties.
            </p>
          </div>
        </aside>

        {/* Right: preview */}
        <div className="rounded-[2rem] border border-border bg-card/50 p-7 sm:p-9">
          <h1 className="font-display text-3xl font-black tracking-tight">Review Questions Preview</h1>
          <p className="mt-2 text-muted-foreground">
            Carefully review the answers and correct selections before going live.
          </p>

          <div className="mt-6 space-y-4">
            {DRAFT_QUESTIONS.map((q, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background/40 p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-sm font-black uppercase tracking-wide text-brand">
                    Question {i + 1} of {REVIEW_STATS.totalQuestions}
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    Timer: {q.timer}s | {q.points} XP
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-bold">{q.prompt}</p>

                <div className="mt-4 space-y-2.5">
                  {q.choices.map((choice, ci) => {
                    const correct = q.correctIndex === ci
                    return (
                      <div
                        key={ci}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                          correct
                            ? 'border-gold bg-gold-soft font-display font-bold text-gold'
                            : 'border-border bg-background/50 text-muted-foreground'
                        }`}
                      >
                        <span>
                          {choice.label}. {choice.text}
                        </span>
                        {correct && (
                          <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 text-gold">
                            <path
                              d="M12 2a10 10 0 1 0 10 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="m8 12 3 3 6-7"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <Link
              href="/create/questions"
              className="font-display text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              Back to Edit Questions
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/create"
                className="rounded-full border border-border bg-background/60 px-6 py-3 font-display text-sm font-bold transition-colors hover:bg-accent"
              >
                Save as Draft
              </Link>
              <Link
                href="/create"
                className="rounded-full bg-gold px-7 py-3 font-display text-sm font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02]"
              >
                Publish to Library
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
