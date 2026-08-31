import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/server'

// GET /api/rooms/[code] — validate a room code for the Join page.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()

  if (!normalized) {
    return NextResponse.json({ valid: false, error: 'Missing room code.' }, { status: 400 })
  }

  const supabase = createAnonClient()
  const { data: room, error } = await supabase
    .from('rooms')
    .select('id, code, status, quiz_id, quizzes(title)')
    .eq('code', normalized)
    .maybeSingle()

  if (error) {
    console.error('[v0] GET /api/rooms/[code] failed:', error)
    return NextResponse.json({ valid: false, error: 'Lookup failed.' }, { status: 500 })
  }

  if (!room) {
    return NextResponse.json({ valid: false, error: 'Room not found.' }, { status: 404 })
  }

  const quizzesRel = room.quizzes as { title: string } | { title: string }[] | null
  const quiz = Array.isArray(quizzesRel) ? (quizzesRel[0] ?? null) : quizzesRel

  return NextResponse.json({
    valid: true,
    room: {
      id: room.id,
      code: room.code,
      status: room.status,
      quizId: room.quiz_id,
      quizTitle: quiz?.title ?? null,
    },
  })
}
