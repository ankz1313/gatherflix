import type { Metadata } from 'next'
import { CreatorNav } from '@/components/creator/creator-nav'
import { QuestionEditor } from '@/components/creator/question-editor'

export const metadata: Metadata = {
  title: 'Add Questions · GatherFlix',
  description: 'Write the questions and answers for your trivia quiz.',
}

export default function QuestionsStepPage() {
  return (
    <div className="min-h-[100dvh]">
      <CreatorNav active="My Quizzes" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <QuestionEditor />
      </main>
    </div>
  )
}
