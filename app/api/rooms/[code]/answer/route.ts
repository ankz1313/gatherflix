import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getQuizWithQuestions } from '@/lib/quiz-data'
import { parseRoomStatus, questionIndexFromPhase } from '@/lib/room-phase'
import { awardPoints, rankPlayers, speedMultiplier } from '@/lib/score'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
const LETTERS = ['A', 'B', 'C', 'D'] as const

// POST /api/rooms/[code]/answer — score a player's lock-in for the current question.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()

  let body: { token?: string; letter?: string; questionIndex?: number; timeRemaining?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400, headers: NO_STORE })
  }

  const token = body.token?.trim()
  const letter = body.letter?.trim().toUpperCase() ?? ''
  const timeRemaining = typeof body.timeRemaining === 'number' ? body.timeRemaining : 0

  if (!normalized) {
    return NextResponse.json({ error: 'Missing room code.' }, { status: 400, headers: NO_STORE })
  }
  if (!token) {
    return NextResponse.json({ error: 'Missing player token.' }, { status: 400, headers: NO_STORE })
  }

  const supabase = createServiceClient()
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id, quiz_id, status')
    .eq('code', normalized)
    .maybeSingle()

  if (roomError || !room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404, headers: NO_STORE })
  }

  const liveIndex = questionIndexFromPhase(parseRoomStatus(room.status))
  const questionIndex =
    typeof body.questionIndex === 'number' ? body.questionIndex : liveIndex

  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, nickname, score, player_token')
    .eq('room_id', room.id)
    .eq('player_token', token)
    .maybeSingle()

  if (playerError || !player) {
    return NextResponse.json({ error: 'Player not found in this room.' }, { status: 404, headers: NO_STORE })
  }

  const quiz = await getQuizWithQuestions(room.quiz_id)
  const question = quiz?.questions[questionIndex]
  if (!quiz || !question) {
    return NextResponse.json({ error: 'Question not found.' }, { status: 404, headers: NO_STORE })
  }

  const choiceIndex = LETTERS.indexOf(letter as (typeof LETTERS)[number])
  const choice =
    question.choices.find((c) => c.label.toUpperCase() === letter) ??
    (choiceIndex >= 0 ? question.choices[choiceIndex] : null)
  const correct = Boolean(choice?.correct)
  const timerSeconds = question.timerSeconds || 20
  const awarded = awardPoints(question.points, timeRemaining, timerSeconds, correct)
  const factor = speedMultiplier(timeRemaining, timerSeconds)
  const totalScore = (player.score ?? 0) + awarded

  const { error: updateError } = await supabase
    .from('players')
    .update({ score: totalScore })
    .eq('id', player.id)

  if (updateError) {
    console.error('[v0] answer score update failed:', updateError)
    return NextResponse.json({ error: 'Failed to save score.' }, { status: 500, headers: NO_STORE })
  }

  const { data: roster } = await supabase
    .from('players')
    .select('id, nickname, score')
    .eq('room_id', room.id)
    .order('score', { ascending: false })

  const ranked = rankPlayers(
    (roster ?? []).map((p) => ({ ...p, score: p.score ?? 0 })),
  )
  const me = ranked.find((p) => p.id === player.id)
  const myIndex = ranked.findIndex((p) => p.id === player.id)
  const nextPlayer = myIndex > 0 ? ranked[myIndex - 1] : null
  const behindNext = nextPlayer ? me!.score - nextPlayer.score : 0

  return NextResponse.json(
    {
      correct,
      awarded,
      base: correct ? question.points : 0,
      multiplier: correct ? `${factor.toFixed(2)}x` : '0x',
      totalScore,
      rank: me?.rank ?? ranked.length,
      behindNext,
      chosenLetter: letter || '—',
      chosenText: choice?.text ?? 'No answer',
    },
    { headers: NO_STORE },
  )
}
