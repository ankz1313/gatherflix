import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/server'

// GET /api/rooms/[code]/players — live roster for the host waiting room.
// Returns the room status plus every player who has joined, oldest first.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()

  if (!normalized) {
    return NextResponse.json({ error: 'Missing room code.' }, { status: 400 })
  }

  const supabase = createAnonClient()

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id, status')
    .eq('code', normalized)
    .maybeSingle()

  if (roomError) {
    console.error('[v0] GET players room lookup failed:', roomError)
    return NextResponse.json({ error: 'Lookup failed.' }, { status: 500 })
  }
  if (!room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
  }

  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, nickname, avatar, score')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true })

  if (playersError) {
    console.error('[v0] GET players list failed:', playersError)
    return NextResponse.json({ error: 'Failed to load players.' }, { status: 500 })
  }

  return NextResponse.json({
    status: room.status,
    players: (players ?? []).map((p) => ({
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      score: p.score,
    })),
  })
}
