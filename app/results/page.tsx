import type { Metadata } from 'next'
import Link from 'next/link'
import { TvPodium } from '@/components/game/tv-podium'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { rankPlayers } from '@/lib/score'
import { createServiceClient } from '@/lib/supabase/server'
import { withoutRoomCursor } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Final Results · GatherFlix',
  description: 'The final leaderboard and podium for your Trivia Night battle.',
}

export default async function ResultsPage({
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
    .select('id, quiz_id')
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

  const [{ data: players }, quiz] = await Promise.all([
    supabase.from('players').select('nickname, avatar, score, player_token').eq('room_id', room.id),
    getQuizWithQuestions(room.quiz_id),
  ])

  const standings = rankPlayers(withoutRoomCursor(players ?? [])).map((p) => ({
    name: p.nickname,
    avatar: p.avatar,
    score: p.score ?? 0,
  }))

  return (
    <TvPodium
      quizTitle={quiz?.title ?? 'GatherFlix'}
      roomCode={normalized}
      standings={standings}
    />
  )
}
