import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CreatorNav } from '@/components/creator/creator-nav'
import { getMyQuizzes } from '@/lib/quiz-data'

export const metadata: Metadata = {
  title: 'My Quizzes · GatherFlix',
  description: 'Create, review, and manage your custom Bollywood movie-night quizzes.',
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

const CreateButton = ({ className = '' }: { className?: string }) => (
  <Link
    href="/create/details"
    className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gold px-7 py-3.5 font-display text-[0.95rem] font-bold text-gold-foreground shadow-[0_10px_45px_-12px] shadow-gold/70 transition-transform hover:scale-[1.02] ${className}`}
  >
    + Create New Quiz
  </Link>
)

export default async function CreatorDashboardPage() {
  const quizzes = await getMyQuizzes()
  const published = quizzes.filter((q) => q.status === 'published').length
  const drafts = quizzes.length - published

  return (
    <div className="min-h-[100dvh]">
      <CreatorNav active="My Quizzes" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Heading */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-display text-5xl font-black tracking-tight text-balance">
              My Cinematic Quizzes
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
              Create, review, and manage your custom Bollywood movie nights. Make your lobby wait
              for the ultimate showdown.
            </p>
          </div>
          <CreateButton />
        </div>

        {quizzes.length === 0 ? (
          /* Empty state */
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border px-6 py-20 text-center">
            <span className="grid size-16 place-items-center rounded-full border-2 border-brand text-3xl text-brand">
              {'\u2726'}
            </span>
            <h2 className="mt-6 font-display text-2xl font-black text-balance">
              You haven&apos;t created any quizzes yet
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground text-pretty">
              Put your Bollywood film knowledge to work! Build your first trivia pack to host with
              friends or publish it publicly.
            </p>
            <CreateButton className="mt-6" />
          </div>
        ) : (
          <>
            {/* Count summary */}
            <div className="mt-8 flex items-center gap-3">
              <span className="rounded-full border-2 border-brand px-5 py-2.5 font-display text-sm font-bold text-brand">
                All Quizzes ({quizzes.length})
              </span>
              <span className="rounded-full border border-border bg-card px-5 py-2.5 font-display text-sm font-bold text-muted-foreground">
                Drafts ({drafts})
              </span>
              <span className="rounded-full border border-border bg-card px-5 py-2.5 font-display text-sm font-bold text-muted-foreground">
                Published ({published})
              </span>
            </div>

            {/* Grid */}
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
                >
                  <div className="relative aspect-[16/9] w-full bg-secondary">
                    {quiz.coverImageUrl ? (
                      <Image
                        src={quiz.coverImageUrl || '/placeholder.svg'}
                        alt={quiz.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="grid size-full place-items-center font-display text-4xl font-black text-muted-foreground/40"
                        aria-hidden="true"
                      >
                        {quiz.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span
                          className="inline-block size-3.5 rounded-full border-2 border-muted-foreground"
                          aria-hidden="true"
                        />
                        {quiz.questionCount} Qs
                      </span>
                      <span
                        className={`rounded-md px-2.5 py-1 font-display text-xs font-bold uppercase ${
                          quiz.status === 'published'
                            ? 'border border-success/50 text-success'
                            : 'border border-gold/50 text-gold'
                        }`}
                      >
                        {quiz.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-black">{quiz.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Created: {formatDate(quiz.createdAt)}
                    </p>
                    <hr className="my-4 border-border" />
                    <div className="mt-auto flex items-center justify-between font-display text-sm font-bold">
                      <Link
                        href={
                          quiz.status === 'published'
                            ? `/host/room?quiz=${quiz.id}`
                            : `/create/questions?quiz=${quiz.id}`
                        }
                        className={quiz.status === 'published' ? 'text-gold' : 'text-brand'}
                      >
                        {quiz.status === 'published' ? 'Host Quiz' : 'Continue Draft'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
