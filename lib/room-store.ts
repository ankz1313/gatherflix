import { createServiceClient } from '@/lib/supabase/server'
import { parseRoomStatus, questionIndexFromPhase } from '@/lib/room-phase'

export type RoomRow = {
  id: string
  code: string
  status: string
  quiz_id: string
  questionIndex: number
}

export const ROOM_CURSOR_NICKNAME = 'gf-round'

export function isRoomCursorPlayer(row: {
  nickname?: string | null
  player_token?: string | null
}) {
  return (
    row.nickname === ROOM_CURSOR_NICKNAME ||
    (row.player_token?.startsWith('gf.cursor.') ?? false)
  )
}

export function withoutRoomCursor<T extends { nickname?: string | null; player_token?: string | null }>(
  players: T[],
) {
  return players.filter((player) => !isRoomCursorPlayer(player))
}

function cursorToken(roomId: string) {
  return `gf.cursor.${roomId}`
}

function parseCursorAvatar(avatar: string | null | undefined) {
  const match = /^q:(\d+)$/.exec(avatar ?? '')
  return match ? Number(match[1]) : null
}

async function readRoomCursor(roomId: string): Promise<number | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('players')
    .select('avatar')
    .eq('room_id', roomId)
    .eq('player_token', cursorToken(roomId))
    .maybeSingle()

  if (error || !data) return null
  return parseCursorAvatar(data.avatar)
}

async function saveRoomCursor(roomId: string, questionIndex: number) {
  const supabase = createServiceClient()
  const token = cursorToken(roomId)
  const avatar = `q:${questionIndex}`
  const { data: existing } = await supabase
    .from('players')
    .select('id')
    .eq('room_id', roomId)
    .eq('player_token', token)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('players')
      .update({ avatar, score: 0 })
      .eq('id', existing.id)
    return !error
  }

  const inserted = await supabase.from('players').insert({
    room_id: roomId,
    nickname: ROOM_CURSOR_NICKNAME,
    avatar,
    player_token: token,
    score: 0,
  })

  if (!inserted.error) return true

  const fallback = await supabase
    .from('players')
    .update({ avatar, score: 0 })
    .eq('room_id', roomId)
    .eq('player_token', token)

  return !fallback.error
}

export async function loadRoomByCode(code: string): Promise<RoomRow | null> {
  const supabase = createServiceClient()
  const full = await supabase
    .from('rooms')
    .select('id, code, status, quiz_id, question_index')
    .eq('code', code)
    .maybeSingle()

  const row = !full.error && full.data ? full.data : null
  const basic = row
    ? null
    : await supabase.from('rooms').select('id, code, status, quiz_id').eq('code', code).maybeSingle()

  const data = row ?? (!basic?.error && basic?.data ? basic.data : null)
  if (!data) return null

  const fromCursor = await readRoomCursor(data.id)
  const fromColumn =
    'question_index' in data && typeof full.data?.question_index === 'number'
      ? full.data.question_index
      : null
  const fromStatus = questionIndexFromPhase(parseRoomStatus(data.status))

  return {
    id: data.id,
    code: data.code,
    status: data.status,
    quiz_id: data.quiz_id,
    questionIndex: fromCursor ?? fromColumn ?? fromStatus,
  }
}

export async function saveRoomProgress(
  code: string,
  status: 'playing' | 'finished',
  questionIndex: number,
) {
  const supabase = createServiceClient()

  // Keep rooms.status on the values the table already allows.
  const saved = await supabase
    .from('rooms')
    .update({ status })
    .eq('code', code)
    .select('id, code, status, quiz_id')
    .maybeSingle()

  if (saved.error || !saved.data) {
    console.error('[v0] saveRoomProgress failed:', saved.error)
    return null
  }

  const withColumn = await supabase
    .from('rooms')
    .update({ question_index: questionIndex })
    .eq('code', code)

  const cursorOk = await saveRoomCursor(saved.data.id, questionIndex)
  if (withColumn.error && !cursorOk) {
    console.error('[v0] saveRoomProgress could not persist question index')
    return null
  }

  return saved.data
}
