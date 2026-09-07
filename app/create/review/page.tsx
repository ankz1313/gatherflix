import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { CreatorNav } from '@/components/creator/creator-nav'
import { getMyQuizForEdit } from '@/lib/quiz-data'
import { setQuizStatus } from '@/app/create/actions'

export const metadata: Metadata = {
  title: 'Review & Publish · GatherFlix',
  description: 'Give your quiz a final look before sharing it with the world.',
}

export default async function ReviewStepPage({
  searchParams,
}: {
  searchParams: Promise<{ quiz?: string }>
}) {
  const { quiz: quizId } = await searchParams
  if (!quizId) redirect('/create/details')

  const quiz = await getMyQuizForEdit(quizId)
  if (!quiz) redirect('/create')

  const totalQuestions = quiz.questions.length
  const totalSeconds = quiz.questions.reduce((sum, q) => sum + (q.timerSeconds ?? 0), 0)
  const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points ?? 0), 0)
  const minutes = Math.max(1, Math.round((totalSeconds || totalQuestions * 20) / 60))
  const tag = quiz.category ?? quiz.subtags[0] ?? 'Bollywood'

  const publishAction = setQuizStatus.bind(null, quizId, 'published')
  const draftAction = setQuizStatus.bind(null, quizId, 'draft')

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
                {quiz.difficulty}
              </span>
              <span className="rounded-md bg-brand-soft px-3 py-1 font-display text-xs font-bold text-brand">
                {tag}
              </span>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Total Questions</dt>
                <dd className="font-display font-bold">{totalQuestions} Questions</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Lobby Duration</dt>
                <dd className="font-display font-bold">Approx. {minutes} mins</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Max Lvl Potential</dt>
                <dd className="font-display font-bold text-gold">
                  {totalPoints.toLocaleString()} XP
                </dd>
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

          {totalQuestions === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-border bg-background/40 px-6 py-12 text-center text-muted-foreground text-pretty">
              This quiz has no questions yet. Go back and add at least one before publishing.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {quiz.questions.map((q, i) => (
                <div key={q.id} className="rounded-2xl border border-border bg-background/40 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-sm font-black uppercase tracking-wide text-brand">
                      Question {i + 1} of {totalQuestions}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      Timer: {q.timerSeconds}s | {q.points} XP
                    </span>
                  </div>
                  <p className="mt-3 font-display text-lg font-bold">{q.text}</p>

                  {q.imageUrl && (
                    <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-background/40">
                      <Image
                        src={q.imageUrl || '/placeholder.svg'}
                        alt={`Media for question ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-4 space-y-2.5">
                    {q.choices.map((choice, ci) => (
                      <div
                        key={ci}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                          choice.correct
                            ? 'border-gold bg-gold-soft font-display font-bold text-gold'
                            : 'border-border bg-background/50 text-muted-foreground'
                        }`}
                      >
                        <span>
                          {choice.label}. {choice.text}
                        </span>
                        {choice.correct && (
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            <Link
              href={`/create/questions?quiz=${quizId}`}
              className="font-display text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              Back to Edit Questions
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <form action={draftAction}>
                <button
                  type="submit"
                  className="rounded-full border border-border bg-background/60 px-6 py-3 font-display text-sm font-bold transition-colors hover:bg-accent"
                >
                  Save as Draft
                </button>
              </form>
              <form action={publishAction}>
                <button
                  type="submit"
                  className="rounded-full bg-gold px-7 py-3 font-display text-sm font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02]"
                >
                  Publish to Library
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
