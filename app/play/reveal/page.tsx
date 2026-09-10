import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { TvReveal } from '@/components/game/tv-reveal'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { parseRoomStatus } from '@/lib/room-phase'
import { loadRoomByCode } from '@/lib/room-store'
import { createServiceClient } from '@/lib/supabase/server'
import { rankPlayers } from '@/lib/score'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Answer Revealed — GatherFlix',
  description: 'The correct answer and live leaderboard.',
}

export default async function RevealPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams
  const normalized = code?.trim()

  if (!normalized) {
    return (
      <main className="container-page flex min-h-[100dvh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-display text-3xl font-extrabold">No live room</h1>
        <Link href="/host" className="font-display font-bold text-gold">
          Back to Host
        </Link>
      </main>
    )
  }

  const room = await loadRoomByCode(normalized)
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

  const phase = parseRoomStatus(room.status, room.questionIndex)
  if (phase.kind === 'finished') {
    redirect(`/results?code=${encodeURIComponent(normalized)}`)
  }

  const questionIndex = room.questionIndex
  const supabase = createServiceClient()
  const [{ data: players }, quiz] = await Promise.all([
    supabase.from('players').select('nickname, avatar, score').eq('room_id', room.id),
    getQuizWithQuestions(room.quiz_id),
  ])

  const question = quiz?.questions[questionIndex]
  const ranked = rankPlayers(
    (players ?? []).map((p) => ({ ...p, score: p.score ?? 0 })),
  ).map((p) => ({
    name: p.nickname,
    avatar: p.avatar,
    score: p.score,
  }))

  const total = quiz?.questions.length ?? 1
  const isLast = questionIndex >= total - 1
  const nextQuestionIndex = questionIndex + 1
  const nextHref = isLast
    ? `/results?code=${encodeURIComponent(normalized)}`
    : `/play?code=${encodeURIComponent(normalized)}&q=${nextQuestionIndex}`

  return (
    <TvReveal
      code={normalized}
      choices={question?.choices ?? []}
      leaders={ranked}
      nextLabel={isLast ? 'Final Results' : 'Next Question'}
      nextStatus={isLast ? 'finished' : 'playing'}
      nextQuestionIndex={isLast ? questionIndex : nextQuestionIndex}
      nextHref={nextHref}
    />
  )
}
