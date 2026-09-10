import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { TvReveal } from '@/components/game/tv-reveal'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { parseRoomStatus, playingStatus, questionIndexFromPhase } from '@/lib/room-phase'
import { rankPlayers } from '@/lib/score'
import { createServiceClient } from '@/lib/supabase/server'

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
  if (phase.kind === 'finished') {
    redirect(`/results?code=${encodeURIComponent(normalized)}`)
  }

  const questionIndex = questionIndexFromPhase(phase)

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

  const total = quiz?.questionCount ?? 1
  const isLast = questionIndex >= total - 1
  const nextStatus = isLast ? 'finished' : playingStatus(questionIndex + 1)
  const nextHref = isLast
    ? `/results?code=${encodeURIComponent(normalized)}`
    : `/play?code=${encodeURIComponent(normalized)}&q=${questionIndex + 1}`

  return (
    <TvReveal
      code={normalized}
      choices={question?.choices ?? []}
      leaders={ranked}
      nextLabel={isLast ? 'Final Results' : 'Next Question'}
      nextStatus={nextStatus}
      nextHref={nextHref}
    />
  )
}
