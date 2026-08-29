// Live game session + room rosters.
//
// SEAM: everything in this file is placeholder data for the pre-backend UI.
// During the API/DB phase, each export below maps to a real source:
//   - CURRENT_SESSION      -> the active game_sessions row (title, host, deck, room code)
//   - ROOM_LOBBY_PLAYERS   -> realtime room_players (desktop lobby view)
//   - JOIN_LOBBY_PLAYERS   -> realtime room_players (mobile join view)
//   - HOST_ROOM_PLAYERS    -> realtime room_players with running scores (host TV view)
//   - generateRoomCode()   -> server-issued, collision-checked room code
//
// Avatars are intentionally typed as `string`: the three views currently use
// three different avatar systems (icon ids, style ids, emoji). Unifying them
// into one avatar model is a schema decision for the DB phase.

export const CURRENT_SESSION = {
  quizTitle: 'Sholay Masala Trivia Night',
  deckSlug: 'classic-90s-romances',
  hostName: 'Rahul Khanna',
  roomName: 'Bollywood Waiting Room',
  minPlayers: 4,
}

// Desktop room lobby — icon-based avatars (see components/avatar-picker).
export type LobbyPlayer = { name: string; avatar: string; host?: boolean }

export const ROOM_LOBBY_PLAYERS: LobbyPlayer[] = [
  { name: 'Rahul Khanna', avatar: 'crown', host: true },
  { name: 'Meera J.', avatar: 'star' },
  { name: 'Dev Patel', avatar: 'music' },
  { name: 'Anjali', avatar: 'ticket' },
]

// Mobile join lobby — style-based avatars (see components/join/avatars).
export type JoinPlayer = { id: string; name: string; avatar: string }

export const JOIN_LOBBY_PLAYERS: JoinPlayer[] = [
  { id: 'p1', name: 'Priya', avatar: 'royal' },
  { id: 'p2', name: 'Arjun', avatar: 'neon' },
  { id: 'p3', name: 'Meera', avatar: 'mint' },
  { id: 'p4', name: 'Vikram', avatar: 'chili' },
  { id: 'p5', name: 'Anjali', avatar: 'gold' },
]

// Host TV waiting room — emoji avatars with running scores.
export type RoomPlayer = { name: string; emoji: string; points: number }

export const HOST_ROOM_PLAYERS: RoomPlayer[] = [
  { name: 'Gabbar', emoji: '\u{1F60E}', points: 890 },
  { name: 'Basanti', emoji: '\u{1F37F}', points: 720 },
  { name: 'Simran', emoji: '\u2728', points: 950 },
  { name: 'Raj', emoji: '\u{1F57A}', points: 1100 },
  { name: 'Rahul', emoji: '\u{1F451}', points: 1400 },
  { name: 'Pooja', emoji: '\u{1F483}', points: 1200 },
  { name: 'Jai', emoji: '\u{1F929}', points: 850 },
  { name: 'Veeru', emoji: '\u{1F981}', points: 1050 },
]

// Client-side placeholder room code. Replace with a server-issued code later.
export function generateRoomCode(length = 6): string {
  let out = ''
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}
