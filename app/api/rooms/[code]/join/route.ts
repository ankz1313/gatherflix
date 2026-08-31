import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// POST /api/rooms/[code]/join — join a room with a nickname + avatar (no login).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const normalized = code?.trim()

  let body: { nickname?: string; avatar?: string; token?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const nickname = body.nickname?.trim()
  const avatar = body.avatar?.trim() || null
  const token = body.token?.trim() || null

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

  const insertRow: { room_id: string; nickname: string; avatar: string | null; player_token?: string } = {
    room_id: room.id,
    nickname,
    avatar,
  }
  if (token) insertRow.player_token = token

  const { data: player, error: insertError } = await supabase
    .from('players')
    .insert(insertRow)
    .select('id, nickname, avatar, score, player_token')
    .single()

  if (insertError) {
    // 23505 = unique_violation on (room_id, nickname).
    if (insertError.code === '23505') {
      // Idempotent rejoin: if the same browser (matching token) already holds
      // this nickname, return that player instead of erroring. This covers
      // React StrictMode's double-invoke and page refreshes. Only a DIFFERENT
      // person taking the nickname is a real conflict.
      const { data: existing } = await supabase
        .from('players')
        .select('id, nickname, avatar, score, player_token')
        .eq('room_id', room.id)
        .eq('nickname', nickname)
        .maybeSingle()

      if (existing && token && existing.player_token === token) {
        return NextResponse.json({
          player: {
            id: existing.id,
            nickname: existing.nickname,
            avatar: existing.avatar,
            score: existing.score,
            token: existing.player_token,
          },
        })
      }

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
