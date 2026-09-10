import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { rankPlayers } from '@/lib/score'
import { withoutRoomCursor } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

// GET /api/rooms/[code]/me?token= — this player's live rank and score.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()
  const token = new URL(request.url).searchParams.get('token')?.trim()

  if (!normalized) {
    return NextResponse.json({ error: 'Missing room code.' }, { status: 400, headers: NO_STORE })
  }
  if (!token) {
    return NextResponse.json({ error: 'Missing player token.' }, { status: 400, headers: NO_STORE })
  }

  const supabase = createServiceClient()
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id, status')
    .eq('code', normalized)
    .maybeSingle()

  if (roomError || !room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404, headers: NO_STORE })
  }

  const { data: roster, error: playersError } = await supabase
    .from('players')
    .select('id, nickname, avatar, score, player_token')
    .eq('room_id', room.id)

  if (playersError) {
    return NextResponse.json({ error: 'Failed to load score.' }, { status: 500, headers: NO_STORE })
  }

  const ranked = rankPlayers(
    withoutRoomCursor(roster ?? []).map((p) => ({ ...p, score: p.score ?? 0 })),
  )
  const me = ranked.find((p) => p.player_token === token)
  if (!me) {
    return NextResponse.json({ error: 'Player not found in this room.' }, { status: 404, headers: NO_STORE })
  }

  return NextResponse.json(
    {
      status: room.status,
      nickname: me.nickname,
      avatar: me.avatar,
      score: me.score,
      rank: me.rank,
      playerCount: ranked.length,
    },
    { headers: NO_STORE },
  )
}
