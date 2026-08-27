import { getAvatarStyle, initialFor } from './avatars'

export function AvatarBadge({
  styleId,
  name,
  size = 56,
}: {
  styleId: string
  name: string
  size?: number
}) {
  const style = getAvatarStyle(styleId)
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-display font-extrabold text-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)]"
      style={{
        width: size,
        height: size,
        background: style.gradient,
        fontSize: size * 0.42,
      }}
      aria-hidden="true"
    >
      {initialFor(name)}
    </span>
  )
}
