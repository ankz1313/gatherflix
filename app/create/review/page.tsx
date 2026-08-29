import type { Metadata } from 'next'
import Link from 'next/link'
import { AppTopbar } from '@/components/app-topbar'
import { CreatorStepper } from '@/components/creator/creator-stepper'
import { AnswerShape } from '@/components/game/answer-shape'
import { ANSWER_STYLES } from '@/lib/game'
import { DRAFT_QUESTIONS } from '@/lib/creator'

export const metadata: Metadata = {
  title: 'Review & Publish · GatherFlix',
  description: 'Give your deck a final look before sharing it with the world.',
}

export default function ReviewStepPage() {
  return (
    <div className="min-h-[100dvh]">
      <AppTopbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <CreatorStepper current={3} />

        <div className="mt-10">
          <h1 className="font-display text-3xl font-black text-balance">Review &amp; Publish</h1>
          <p className="mt-2 text-muted-foreground">
            One last look before your deck goes live.
          </p>
        </div>

        {/* Deck summary */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-black">Sholay Masala Night</h2>
              <p className="mt-1 text-muted-foreground">
                Test your knowledge of the greatest curry-western ever made.
              </p>
            </div>
            <Link
              href="/create/details"
              className="shrink-0 text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              Edit
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-gold-soft px-3 py-1 font-display text-xs font-bold text-gold">
              Medium
            </span>
            <span className="rounded-full bg-brand-soft px-3 py-1 font-display text-xs font-bold text-brand">
              Classics
            </span>
            <span className="rounded-full bg-brand-soft px-3 py-1 font-display text-xs font-bold text-brand">
              Action
            </span>
            <span className="rounded-full bg-secondary px-3 py-1 font-display text-xs font-bold text-muted-foreground">
              {DRAFT_QUESTIONS.length} questions
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="mt-6 flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold">Questions</h3>
          <Link
            href="/create/questions"
            className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            Edit all
          </Link>
        </div>
        <ol className="mt-3 space-y-3">
          {DRAFT_QUESTIONS.map((q, i) => (
            <li key={i} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display font-bold">
                <span className="text-muted-foreground">{i + 1}.</span> {q.prompt}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {q.options.map((option, oi) => {
                  const style = ANSWER_STYLES[oi]
                  const correct = q.correctIndex === oi
                  return (
                    <div
                      key={oi}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                        correct ? 'bg-success-soft font-bold text-success' : 'bg-background text-muted-foreground'
                      }`}
                    >
                      <span
                        className="grid size-5 shrink-0 place-items-center rounded-md"
                        style={{ backgroundColor: style.color }}
                      >
                        <AnswerShape shape={style.shape} className="size-2.5 fill-white text-white" />
                      </span>
                      <span className="line-clamp-1">{option}</span>
                    </div>
                  )
                })}
              </div>
            </li>
          ))}
        </ol>

        {/* Publish */}
        <div className="mt-10 flex items-center justify-between">
          <Link
            href="/create/questions"
            className="rounded-full border border-border bg-secondary px-6 py-3 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent"
          >
            Back
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-display text-base font-bold text-gold-foreground shadow-[0_10px_45px_-14px] shadow-gold/70 transition-transform hover:scale-[1.02]"
          >
            Publish Deck
          </Link>
        </div>
      </main>
    </div>
  )
}
