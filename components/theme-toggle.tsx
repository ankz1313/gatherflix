'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex h-9 w-[3.75rem] shrink-0 cursor-pointer items-center rounded-full border border-border bg-secondary px-1 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      <span
        className={`flex size-7 items-center justify-center rounded-full transition-transform duration-300 ease-out ${
          isDark ? 'translate-x-[1.5rem] bg-brand text-brand-foreground' : 'translate-x-0 bg-gold text-gold-foreground'
        }`}
      >
        {isDark ? (
          <Moon className="size-4" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Sun className="size-4" strokeWidth={2.5} aria-hidden="true" />
        )}
      </span>
    </button>
  )
}
