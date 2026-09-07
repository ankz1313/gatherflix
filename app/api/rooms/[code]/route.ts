import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

// GET /api/rooms/[code] — validate a room code for the Join page.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()

  if (!normalized) {
    return NextResponse.json({ valid: false, error: 'Missing room code.' }, { status: 400, headers: NO_STORE })
  }

  const supabase = createServiceClient()
  const { data: room, error } = await supabase
    .from('rooms')
    .select('id, code, status, quiz_id, quizzes(title)')
    .eq('code', normalized)
    .maybeSingle()

  if (error) {
    console.error('[v0] GET /api/rooms/[code] failed:', error)
    return NextResponse.json({ valid: false, error: 'Lookup failed.' }, { status: 500, headers: NO_STORE })
  }

  if (!room) {
    return NextResponse.json({ valid: false, error: 'Room not found.' }, { status: 404, headers: NO_STORE })
  }

  const quizzesRel = room.quizzes as { title: string } | { title: string }[] | null
  const quiz = Array.isArray(quizzesRel) ? (quizzesRel[0] ?? null) : quizzesRel

  return NextResponse.json(
    {
      valid: true,
      room: {
        id: room.id,
        code: room.code,
        status: room.status,
        quizId: room.quiz_id,
        quizTitle: quiz?.title ?? null,
      },
    },
    { headers: NO_STORE },
  )
}
