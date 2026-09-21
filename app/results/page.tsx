import type { Metadata } from 'next'
import Link from 'next/link'
import { TvPodium } from '@/components/game/tv-podium'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { rankPlayers } from '@/lib/score'
import { SITE_URL } from '@/lib/site'
import { createServiceClient } from '@/lib/supabase/server'
import { withoutRoomCursor } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}): Promise<Metadata> {
  const { code } = await searchParams
  const normalized = code?.trim()
  if (!normalized) {
    return {
      title: 'Final Results · GatherFlix',
      description: 'The final leaderboard for a GatherFlix trivia night.',
    }
  }
  return {
    title: `Final standings · Room ${normalized} · GatherFlix`,
    description: 'See who took the podium at this GatherFlix trivia night.',
    openGraph: {
      title: `GatherFlix leaderboard · Room ${normalized}`,
      description: 'Final standings from a live trivia night.',
      url: `${SITE_URL}/results?code=${encodeURIComponent(normalized)}`,
    },
  }
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
        <Link href="/" className="font-display font-bold text-gold">
          Back to Home
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
        <Link href="/" className="font-display font-bold text-gold">
          Back to Home
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
