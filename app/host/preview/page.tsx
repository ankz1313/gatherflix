import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { HostTopbar } from '@/components/host/host-topbar'
import { getDeck, difficultyClass } from '@/lib/decks'
import {
  getQuizWithQuestions,
  getPublishedQuizIdByTitle,
  type QuizWithQuestions,
} from '@/lib/quiz-data'

export const metadata: Metadata = {
  title: 'Host a Room · Quiz Preview — GatherFlix',
  description: 'Preview your chosen Bollywood trivia deck before going live.',
}

const FALLBACK_IMAGE = '/decks/deck-classic-90s-romance.png'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 text-gold" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12 2.3 2.3 4.7-4.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

async function resolveQuiz(
  quizId?: string,
  slug?: string,
): Promise<QuizWithQuestions | null> {
  let id = quizId
  if (!id && slug) {
    // Bridge the legacy static deck slug to a real published quiz by title.
    id = (await getPublishedQuizIdByTitle(getDeck(slug).title)) ?? undefined
  }
  if (!id) return null
  return getQuizWithQuestions(id)
}

export default async function HostPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ quiz?: string; deck?: string }>
}) {
  const { quiz: quizId, deck: slug } = await searchParams
  const quiz = await resolveQuiz(quizId, slug)

  if (!quiz) {
    return (
      <>
        <HostTopbar active="library" />
        <main className="container-page flex flex-col items-center gap-4 py-24 text-center">
          <h1 className="font-display text-3xl font-extrabold">Quiz not found</h1>
          <p className="max-w-sm text-muted-foreground">
            This quiz pack is no longer available. Browse the library to pick another.
          </p>
          <Link
            href="/library"
            className="rounded-full bg-gold px-6 py-3 font-display font-bold text-gold-foreground"
          >
            Back to Library
          </Link>
        </main>
      </>
    )
  }

  const sample = quiz.questions[0]
  const correctIndex = sample ? sample.choices.findIndex((c) => c.correct) : -1

  return (
    <>
      <HostTopbar active="library" />

      <main className="container-page py-8 lg:py-10">
        <Link
          href="/library"
          className="inline-flex items-center gap-2 font-display text-sm font-bold text-brand"
        >
          &larr; Back to Library
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left: cover + details */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-[0_0_40px_-12px] shadow-brand/40">
              <div className="relative aspect-[16/9]">
                <Image
                  src={quiz.coverImageUrl ?? FALLBACK_IMAGE}
                  alt={quiz.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span
                className={`rounded-md px-2.5 py-1 font-display text-[0.7rem] font-bold uppercase tracking-wide ${difficultyClass(
                  quiz.difficulty,
                )}`}
              >
                {quiz.difficulty}
              </span>
              {quiz.category && (
                <span className="text-sm text-muted-foreground">{quiz.category}</span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-balance lg:text-5xl">
              {quiz.title}
            </h1>
            {quiz.description && (
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                {quiz.description}
              </p>
            )}

            <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-border">
              <div className="p-5">
                <p className="font-display text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                  Questions
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold">
                  {quiz.questionCount} Qs
                </p>
              </div>
              <div className="border-l border-border p-5">
                <p className="font-display text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                  Time to Play
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold text-gold">
                  {quiz.minutes} mins
                </p>
              </div>
              <div className="border-l border-border p-5">
                <p className="font-display text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                  Difficulty
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold">{quiz.difficulty}</p>
              </div>
            </div>

            <Link
              href={`/host/room?quiz=${quiz.id}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-4 font-display text-lg font-bold text-gold-foreground shadow-[0_10px_45px_-10px] shadow-gold/70 transition-transform hover:scale-[1.01]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Host This Quiz Now
            </Link>
          </div>

          {/* Right: sample trivia preview */}
          <div>
            <h2 className="font-display text-xl font-bold text-brand">Sample Trivia Preview</h2>

            {sample ? (
              <div className="mt-4 rounded-3xl border border-brand/40 bg-card/40 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[0.7rem] font-bold uppercase tracking-wide text-brand">
                    Question 1 of {quiz.questionCount}
                  </span>
                  <span className="rounded-md bg-brand-soft px-2.5 py-1 font-display text-[0.65rem] font-bold uppercase tracking-wide text-brand">
                    +{sample.points} Gold Points
                  </span>
                </div>

                <p className="mt-4 font-display text-2xl font-bold leading-snug text-balance">
                  {sample.text}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {sample.choices.map((opt, i) => {
                    const correct = i === correctIndex
                    return (
                      <li
                        key={opt.label}
                        className={`flex items-center justify-between rounded-xl border px-5 py-3.5 ${
                          correct ? 'border-gold bg-gold-soft' : 'border-border bg-background/40'
                        }`}
                      >
                        <span
                          className={`font-display text-[0.95rem] font-bold ${
                            correct ? 'text-gold' : ''
                          }`}
                        >
                          {opt.label}. {opt.text}
                        </span>
                        {correct && <CheckIcon />}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">
                This quiz has no questions yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
