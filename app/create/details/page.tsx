import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CreatorNav } from '@/components/creator/creator-nav'
import { QuizDetailsForm, type QuizDetailsInitial } from '@/components/creator/quiz-details-form'
import { getMyQuizForEdit } from '@/lib/quiz-data'

export const metadata: Metadata = {
  title: 'Quiz Settings · GatherFlix',
  description: 'Give your new trivia quiz a name and personality.',
}

export default async function DetailsStepPage({
  searchParams,
}: {
  searchParams: Promise<{ quiz?: string }>
}) {
  const { quiz: quizId } = await searchParams

  let initial: QuizDetailsInitial | undefined
  if (quizId) {
    const quiz = await getMyQuizForEdit(quizId)
    if (!quiz) redirect('/create')
    initial = {
      quizId: quiz.id,
      title: quiz.title,
      description: quiz.description ?? '',
      category: quiz.category,
      subtags: quiz.subtags,
      difficulty: quiz.difficulty,
      coverImageUrl: quiz.coverImageUrl,
    }
  }

  return (
    <div className="min-h-[100dvh]">
      <CreatorNav active="My Quizzes" />
      <QuizDetailsForm initial={initial} />
    </div>
  )
}
