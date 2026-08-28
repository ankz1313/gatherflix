export type AvatarStyle = {
  id: string
  label: string
  gradient: string
  ring: string
}

// Six distinct gradient chips drawn from the GatherFlix brand palette
// (magenta / gold / plum) so player avatars stay on-brand.
export const AVATAR_STYLES: AvatarStyle[] = [
  { id: 'masala', label: 'Masala', gradient: 'linear-gradient(135deg,#ec1b78,#ff5fa2)', ring: '#ec1b78' },
  { id: 'gold', label: 'Gold', gradient: 'linear-gradient(135deg,#ff9f00,#ffc861)', ring: '#ff9f00' },
  { id: 'royal', label: 'Royal', gradient: 'linear-gradient(135deg,#7b2ff7,#b06bff)', ring: '#8f3df0' },
  { id: 'neon', label: 'Neon', gradient: 'linear-gradient(135deg,#00b8d4,#5de0f0)', ring: '#00b8d4' },
  { id: 'chili', label: 'Chili', gradient: 'linear-gradient(135deg,#e53935,#ff7a6b)', ring: '#e53935' },
  { id: 'mint', label: 'Mint', gradient: 'linear-gradient(135deg,#1faa72,#5fe0a8)', ring: '#1faa72' },
]

export function getAvatarStyle(id: string | null | undefined): AvatarStyle {
  return AVATAR_STYLES.find((a) => a.id === id) ?? AVATAR_STYLES[0]
}

export function initialFor(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed[0].toUpperCase() : '?'
}
