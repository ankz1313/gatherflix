'use client'

import { useRef } from 'react'

const LENGTH = 6
const ALLOWED = /[^A-Z0-9]/g

type RoomCodeInputProps = {
  value: string
  onChange: (next: string) => void
  onComplete?: (code: string) => void
  invalid?: boolean
}

export function RoomCodeInput({ value, onChange, onComplete, invalid }: RoomCodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const chars = value.padEnd(LENGTH, ' ').slice(0, LENGTH).split('')

  const commit = (next: string) => {
    const clean = next.toUpperCase().replace(ALLOWED, '').slice(0, LENGTH)
    onChange(clean)
    if (clean.length === LENGTH) {
      refs.current[LENGTH - 1]?.blur()
      onComplete?.(clean)
    }
    return clean
  }

  const handleChange = (index: number, raw: string) => {
    // Typing into a filled box replaces from that position onward.
    const typed = raw.toUpperCase().replace(ALLOWED, '')
    if (!typed) return

    const next = (value.slice(0, index) + typed).slice(0, LENGTH)
    const clean = commit(next)
    const focusAt = Math.min(clean.length, LENGTH - 1)
    refs.current[focusAt]?.focus()
    refs.current[focusAt]?.select()
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      if (value[index]) {
        commit(value.slice(0, index) + value.slice(index + 1))
        refs.current[index]?.focus()
        return
      }
      const prev = Math.max(0, index - 1)
      commit(value.slice(0, prev))
      refs.current[prev]?.focus()
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      refs.current[index - 1]?.focus()
      refs.current[index - 1]?.select()
    }

    if (event.key === 'ArrowRight' && index < LENGTH - 1) {
      event.preventDefault()
      refs.current[index + 1]?.focus()
      refs.current[index + 1]?.select()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const clean = commit(event.clipboardData.getData('text'))
    refs.current[Math.min(clean.length, LENGTH - 1)]?.focus()
  }

  return (
    <div className="flex gap-2 sm:gap-3" role="group" aria-label="Room code, 6 characters">
      {chars.map((char, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          value={char.trim()}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="one-time-code"
          spellCheck={false}
          maxLength={LENGTH}
          aria-label={`Character ${index + 1}`}
          aria-invalid={invalid || undefined}
          className={`h-16 w-full min-w-0 rounded-2xl border bg-secondary/60 text-center font-display text-2xl font-extrabold uppercase text-foreground caret-brand transition-colors focus:border-gold focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-gold/40 sm:h-[4.5rem] sm:text-[1.75rem] ${
            invalid ? 'border-destructive' : 'border-input'
          }`}
        />
      ))}
    </div>
  )
}
