// Live game session + room rosters.
//
// SEAM: everything in this file is placeholder data for the pre-backend UI.
// During the API/DB phase, each export below maps to a real source:
//   - CURRENT_SESSION      -> the active game_sessions row (title, host, deck, room code)
//   - ROOM_LOBBY_PLAYERS   -> realtime room_players (desktop lobby view)
//   - JOIN_LOBBY_PLAYERS   -> realtime room_players (mobile join view)
//   - generateRoomCode()   -> server-issued, collision-checked room code
//
// The host waiting room now reads live players from GET /api/rooms/[code]/players.
//
// Avatars are intentionally typed as `string`: the three views currently use
// three different avatar systems (icon ids, style ids, emoji). Unifying them
// into one avatar model is a schema decision for the DB phase.

export const CURRENT_SESSION = {
  quizTitle: 'Sholay Masala Trivia Night',
  deckSlug: 'classic-90s-romances',
  hostName: 'Rahul Khanna',
  roomName: 'Bollywood Waiting Room',
  minPlayers: 1,
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

// Client-side placeholder room code. Replace with a server-issued code later.
export function generateRoomCode(length = 6): string {
  let out = ''
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}
