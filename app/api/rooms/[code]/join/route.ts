import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// POST /api/rooms/[code]/join — join a room with a nickname + avatar (no login).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()

  let body: { nickname?: string; avatar?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const nickname = body.nickname?.trim()
  const avatar = body.avatar?.trim() || null

  if (!normalized) {
    return NextResponse.json({ error: 'Missing room code.' }, { status: 400 })
  }
  if (!nickname || nickname.length < 2 || nickname.length > 16) {
    return NextResponse.json({ error: 'Nickname must be 2-16 characters.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Room must exist and still be accepting players.
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id, status')
    .eq('code', normalized)
    .maybeSingle()

  if (roomError) {
    console.error('[v0] POST join room lookup failed:', roomError)
    return NextResponse.json({ error: 'Failed to join room.' }, { status: 500 })
  }
  if (!room) {
    return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
  }
  if (room.status !== 'lobby') {
    return NextResponse.json({ error: 'This game has already started.' }, { status: 409 })
  }

  const { data: player, error: insertError } = await supabase
    .from('players')
    .insert({ room_id: room.id, nickname, avatar })
    .select('id, nickname, avatar, score, player_token')
    .single()

  if (insertError) {
    // 23505 = unique_violation on (room_id, nickname).
    if (insertError.code === '23505') {
      return NextResponse.json(
        { error: 'That nickname is already taken in this room.' },
        { status: 409 },
      )
    }
    console.error('[v0] POST join insert failed:', insertError)
    return NextResponse.json({ error: 'Failed to join room.' }, { status: 500 })
  }

  return NextResponse.json({
    player: {
      id: player.id,
      nickname: player.nickname,
      avatar: player.avatar,
      score: player.score,
      token: player.player_token,
    },
  })
}
