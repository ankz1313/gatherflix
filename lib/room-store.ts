import { createServiceClient } from '@/lib/supabase/server'
import { parseRoomStatus, questionIndexFromPhase } from '@/lib/room-phase'

export type RoomRow = {
  id: string
  code: string
  status: string
  quiz_id: string
  questionIndex: number
}

export async function loadRoomByCode(code: string): Promise<RoomRow | null> {
  const supabase = createServiceClient()
  const full = await supabase
    .from('rooms')
    .select('id, code, status, quiz_id, question_index')
    .eq('code', code)
    .maybeSingle()

  if (!full.error && full.data) {
    const questionIndex =
      typeof full.data.question_index === 'number'
        ? full.data.question_index
        : questionIndexFromPhase(parseRoomStatus(full.data.status))
    return {
      id: full.data.id,
      code: full.data.code,
      status: full.data.status,
      quiz_id: full.data.quiz_id,
      questionIndex,
    }
  }

  const basic = await supabase
    .from('rooms')
    .select('id, code, status, quiz_id')
    .eq('code', code)
    .maybeSingle()

  if (basic.error || !basic.data) return null
  return {
    id: basic.data.id,
    code: basic.data.code,
    status: basic.data.status,
    quiz_id: basic.data.quiz_id,
    questionIndex: questionIndexFromPhase(parseRoomStatus(basic.data.status)),
  }
}

export async function saveRoomProgress(
  code: string,
  status: 'playing' | 'finished',
  questionIndex: number,
) {
  const supabase = createServiceClient()

  const withColumn = await supabase
    .from('rooms')
    .update({ status, question_index: questionIndex })
    .eq('code', code)
    .select('id, code, status, quiz_id, question_index')
    .maybeSingle()

  if (!withColumn.error && withColumn.data) {
    return withColumn.data
  }

  const encoded = status === 'finished' ? 'finished' : questionIndex <= 0 ? 'playing' : `playing:${questionIndex}`
  const fallback = await supabase
    .from('rooms')
    .update({ status: encoded })
    .eq('code', code)
    .select('id, code, status, quiz_id')
    .maybeSingle()

  if (fallback.error) {
    console.error('[v0] saveRoomProgress failed:', withColumn.error, fallback.error)
    return null
  }
  return fallback.data
}
