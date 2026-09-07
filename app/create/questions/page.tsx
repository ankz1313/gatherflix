import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CreatorNav } from '@/components/creator/creator-nav'
import { QuestionEditor } from '@/components/creator/question-editor'
import { getMyQuizForEdit } from '@/lib/quiz-data'
import type { DraftQuestion } from '@/lib/creator'

export const metadata: Metadata = {
  title: 'Add Questions · GatherFlix',
  description: 'Write the questions and answers for your trivia quiz.',
}

export default async function QuestionsStepPage({
  searchParams,
}: {
  searchParams: Promise<{ quiz?: string }>
}) {
  const { quiz: quizId } = await searchParams
  if (!quizId) redirect('/create/details')

  const quiz = await getMyQuizForEdit(quizId)
  if (!quiz) redirect('/create')

  const initialQuestions: DraftQuestion[] = quiz.questions.map((q) => ({
    prompt: q.text,
    imageUrl: q.imageUrl,
    choices: q.choices.map((c) => ({ label: c.label, text: c.text })),
    correctIndex: Math.max(
      0,
      q.choices.findIndex((c) => c.correct),
    ),
    timer: q.timerSeconds,
    points: q.points,
  }))

  return (
    <div className="min-h-[100dvh]">
      <CreatorNav active="My Quizzes" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <QuestionEditor quizId={quizId} quizTitle={quiz.title} initialQuestions={initialQuestions} />
      </main>
    </div>
  )
}
