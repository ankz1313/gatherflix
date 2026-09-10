export type RoomPhase =
  | { kind: 'lobby' }
  | { kind: 'playing'; questionIndex: number }
  | { kind: 'reveal'; questionIndex: number }
  | { kind: 'finished' }

export function parseRoomStatus(status: string | null | undefined): RoomPhase {
  if (!status || status === 'lobby') return { kind: 'lobby' }
  if (status === 'finished') return { kind: 'finished' }
  if (status === 'playing') return { kind: 'playing', questionIndex: 0 }
  const playing = /^playing:(\d+)$/.exec(status)
  if (playing) return { kind: 'playing', questionIndex: Number(playing[1]) }
  const reveal = /^reveal:(\d+)$/.exec(status)
  if (reveal) return { kind: 'reveal', questionIndex: Number(reveal[1]) }
  return { kind: 'playing', questionIndex: 0 }
}

export function playingStatus(questionIndex: number) {
  return questionIndex <= 0 ? 'playing' : `playing:${questionIndex}`
}

export function revealStatus(questionIndex: number) {
  return `reveal:${questionIndex}`
}

export function isAllowedRoomStatus(status: string) {
  return (
    status === 'playing' ||
    status === 'finished' ||
    /^playing:\d+$/.test(status) ||
    /^reveal:\d+$/.test(status)
  )
}

export function questionIndexFromPhase(phase: RoomPhase) {
  if (phase.kind === 'playing' || phase.kind === 'reveal') return phase.questionIndex
  return 0
}
