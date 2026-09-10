import { NextResponse } from 'next/server'
import { parseRoomStatus } from '@/lib/room-phase'
import { loadRoomByCode } from '@/lib/room-store'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()

  if (!normalized) {
    return NextResponse.json({ error: 'Missing room code.' }, { status: 400, headers: NO_STORE })
  }

  const room = await loadRoomByCode(normalized)
  if (!room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404, headers: NO_STORE })
  }

  const supabase = createServiceClient()
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, nickname, avatar, score')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true })

  if (playersError) {
    console.error('[v0] GET players list failed:', playersError)
    return NextResponse.json({ error: 'Failed to load players.' }, { status: 500, headers: NO_STORE })
  }

  const phase = parseRoomStatus(room.status, room.questionIndex)

  return NextResponse.json(
    {
      status: room.status,
      questionIndex: room.questionIndex,
      phase: phase.kind,
      players: (players ?? []).map((p) => ({
        id: p.id,
        nickname: p.nickname,
        avatar: p.avatar,
        score: p.score,
      })),
    },
    { headers: NO_STORE },
  )
}
