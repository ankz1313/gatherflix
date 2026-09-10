export type RoomPhase =
  | { kind: 'lobby' }
  | { kind: 'playing'; questionIndex: number }
  | { kind: 'finished' }

export function parseRoomStatus(
  status: string | null | undefined,
  questionIndex?: number | null,
): RoomPhase {
  if (!status || status === 'lobby') return { kind: 'lobby' }
  if (status === 'finished') return { kind: 'finished' }

  if (typeof questionIndex === 'number' && Number.isFinite(questionIndex) && questionIndex >= 0) {
    return { kind: 'playing', questionIndex }
  }

  if (status === 'playing') return { kind: 'playing', questionIndex: 0 }
  const playing = /^playing:(\d+)$/.exec(status)
  if (playing) return { kind: 'playing', questionIndex: Number(playing[1]) }
  const reveal = /^reveal:(\d+)$/.exec(status)
  if (reveal) return { kind: 'playing', questionIndex: Number(reveal[1]) }
  return { kind: 'playing', questionIndex: 0 }
}

export function isCoreRoomStatus(status: string): status is 'lobby' | 'playing' | 'finished' {
  return status === 'lobby' || status === 'playing' || status === 'finished'
}

export function questionIndexFromPhase(phase: RoomPhase) {
  return phase.kind === 'playing' ? phase.questionIndex : 0
}
