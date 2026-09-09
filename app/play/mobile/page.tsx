import type { Metadata } from 'next'
import { MobileShell } from '@/components/mobile-shell'
import { MobileAnswer } from '@/components/game/mobile-answer'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { createServiceClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Your Answer · GatherFlix',
  description: 'Tap fast to lock in your answer and climb the leaderboard.',
}

export default async function MobilePlayPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams
  const normalized = code?.trim()

  let round = 1
  let totalQuestions = 1
  let points = 250
  let timerSeconds = 20
  let choices: { label: string; text: string }[] = []

  if (normalized) {
    const supabase = createServiceClient()
    const { data: room } = await supabase
      .from('rooms')
      .select('quiz_id')
      .eq('code', normalized)
      .maybeSingle()
    if (room) {
      const quiz = await getQuizWithQuestions(room.quiz_id)
      const question = quiz?.questions[0]
      if (quiz && question) {
        round = 1
        totalQuestions = quiz.questionCount
        points = question.points
        timerSeconds = question.timerSeconds || 20
        choices = question.choices.map((c) => ({ label: c.label, text: c.text }))
      }
    }
  }

  return (
    <MobileShell>
      <MobileAnswer
        code={normalized ?? ''}
        round={round}
        totalQuestions={totalQuestions}
        points={points}
        timerSeconds={timerSeconds}
        choices={choices}
      />
    </MobileShell>
  )
}
