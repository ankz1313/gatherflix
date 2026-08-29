import type { Metadata } from 'next'
import { CreatorNav } from '@/components/creator/creator-nav'
import { QuizDetailsForm } from '@/components/creator/quiz-details-form'

export const metadata: Metadata = {
  title: 'Quiz Settings · GatherFlix',
  description: 'Give your new trivia quiz a name and personality.',
}

export default function DetailsStepPage() {
  return (
    <div className="min-h-[100dvh]">
      <CreatorNav active="My Quizzes" />
      <QuizDetailsForm />
    </div>
  )
}
