import type { Metadata } from 'next'
import Link from 'next/link'
import { TvReveal } from '@/components/game/tv-reveal'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { rankPlayers } from '@/lib/score'
import { createServiceClient } from '@/lib/supabase/server'

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
    supabase.from('players').select('nickname, avatar, score').eq('room_id', room.id),
    getQuizWithQuestions(room.quiz_id),
  ])

  const question = quiz?.questions[0]
  const ranked = rankPlayers(players ?? []).map((p) => ({
    name: p.nickname,
    avatar: p.avatar,
    score: p.score ?? 0,
  }))

  return (
    <TvReveal
      code={normalized}
      choices={question?.choices ?? []}
      leaders={ranked}
      resultsHref={`/results?code=${encodeURIComponent(normalized)}`}
    />
  )
}
