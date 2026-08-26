import { Film } from 'lucide-react'

export function GatherflixLogo() {
  return (
    <a href="/" className="flex items-center gap-2.5" aria-label="GatherFlix home">
      <Film className="size-7 shrink-0 text-brand" strokeWidth={2.25} aria-hidden="true" />
      <span className="font-display text-xl font-extrabold tracking-tight sm:text-[1.4rem]">
        <span className="text-foreground">GATHER</span>
        <span className="text-gold">FLIX</span>
      </span>
    </a>
  )
}
