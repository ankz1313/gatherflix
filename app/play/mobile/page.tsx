import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MobileShell } from '@/components/mobile-shell'
import { MobileAnswer } from '@/components/game/mobile-answer'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { parseRoomStatus } from '@/lib/room-phase'
import { loadRoomByCode } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

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
  let questionIndex = 0

  if (normalized) {
    const room = await loadRoomByCode(normalized)
    if (room) {
      const phase = parseRoomStatus(room.status, room.questionIndex)
      if (phase.kind === 'finished') {
        redirect(`/results/mobile?code=${encodeURIComponent(normalized)}`)
      }
      questionIndex = room.questionIndex
      const quiz = await getQuizWithQuestions(room.quiz_id)
      const question = quiz?.questions[questionIndex]
      if (quiz && question) {
        round = questionIndex + 1
        totalQuestions = quiz.questions.length
        points = question.points
        timerSeconds = question.timerSeconds || 20
        choices = question.choices.map((c) => ({ label: c.label, text: c.text }))
      }
    }
  }

  return (
    <MobileShell>
      <MobileAnswer
        key={questionIndex}
        code={normalized ?? ''}
        questionIndex={questionIndex}
        round={round}
        totalQuestions={totalQuestions}
        points={points}
        timerSeconds={timerSeconds}
        choices={choices}
      />
    </MobileShell>
  )
}
