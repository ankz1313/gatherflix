import { Triangle, Diamond, Circle, Square } from 'lucide-react'
import type { AnswerStyle } from '@/lib/game'

const ICONS = {
  triangle: Triangle,
  diamond: Diamond,
  circle: Circle,
  square: Square,
} as const

export function AnswerShape({
  shape,
  className,
}: {
  shape: AnswerStyle['shape']
  className?: string
}) {
  const Icon = ICONS[shape]
  return <Icon className={className} aria-hidden="true" />
}
