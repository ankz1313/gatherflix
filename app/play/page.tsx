import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { TvQuestion } from '@/components/game/tv-question'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { parseRoomStatus, questionIndexFromPhase } from '@/lib/room-phase'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Live Question — GatherFlix',
  description: 'The live game question screen for the big screen.',
}

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; q?: string }>
}) {
  const { code, q } = await searchParams
  const normalized = code?.trim()
  const qParam = Number.parseInt(q ?? '', 10)

  if (!normalized) {
    return (
      <main className="container-page flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-display text-3xl font-extrabold">No live room</h1>
        <p className="text-muted-foreground">Start the game from the host waiting room.</p>
        <Link href="/host" className="font-display font-bold text-gold">
          Back to Host
        </Link>
      </main>
    )
  }

  const supabase = createServiceClient()
  const { data: room } = await supabase
    .from('rooms')
    .select('id, quiz_id, status')
    .eq('code', normalized)
    .maybeSingle()

  if (!room) {
    return (
      <main className="container-page flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-display text-3xl font-extrabold">Room not found</h1>
        <Link href="/host" className="font-display font-bold text-gold">
          Back to Host
        </Link>
      </main>
    )
  }

  const phase = parseRoomStatus(room.status)
  if (phase.kind === 'finished' && !Number.isFinite(qParam)) {
    redirect(`/results?code=${encodeURIComponent(normalized)}`)
  }
  if (phase.kind === 'reveal' && !Number.isFinite(qParam)) {
    redirect(`/play/reveal?code=${encodeURIComponent(normalized)}`)
  }

  const questionIndex = Number.isFinite(qParam)
    ? qParam
    : questionIndexFromPhase(phase)

  const [{ data: players }, quiz] = await Promise.all([
    supabase.from('players').select('id').eq('room_id', room.id),
    getQuizWithQuestions(room.quiz_id),
  ])

  const question = quiz?.questions[questionIndex]
  if (!quiz || !question) {
    return (
      <main className="container-page flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-display text-3xl font-extrabold">This quiz has no questions</h1>
        <Link href="/host" className="font-display font-bold text-gold">
          Back to Host
        </Link>
      </main>
    )
  }

  return (
    <TvQuestion
      code={normalized}
      questionIndex={questionIndex}
      prompt={question.text}
      category={quiz.category}
      points={question.points}
      imageUrl={question.imageUrl}
      questionNumber={questionIndex + 1}
      totalQuestions={quiz.questionCount}
      timerSeconds={question.timerSeconds || 20}
      playerCount={players?.length ?? 0}
      revealHref={`/play/reveal?code=${encodeURIComponent(normalized)}`}
      choices={question.choices.map((c) => ({ label: c.label, text: c.text }))}
    />
  )
}
