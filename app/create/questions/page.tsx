import type { Metadata } from 'next'
import { AppTopbar } from '@/components/app-topbar'
import { CreatorStepper } from '@/components/creator/creator-stepper'
import { QuestionEditor } from '@/components/creator/question-editor'

export const metadata: Metadata = {
  title: 'Add Questions · GatherFlix',
  description: 'Write the questions and answers for your trivia deck.',
}

export default function QuestionsStepPage() {
  return (
    <div className="min-h-[100dvh]">
      <AppTopbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <CreatorStepper current={2} />
        <div className="mt-10 mb-8">
          <h1 className="font-display text-3xl font-black text-balance">Add Your Questions</h1>
          <p className="mt-2 text-muted-foreground">
            Write the prompts, fill four options, and mark the right answer.
          </p>
        </div>
        <QuestionEditor />
      </main>
    </div>
  )
}
