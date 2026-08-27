'use client'

import {
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'

const LENGTH = 6

export function RoomCodeInput({
  onComplete,
}: {
  onComplete?: (code: string) => void
}) {
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(''))
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  function focusBox(i: number) {
    inputs.current[i]?.focus()
    inputs.current[i]?.select()
  }

  function setChar(i: number, char: string) {
    setValues((prev) => {
      const next = [...prev]
      next[i] = char
      if (next.every((c) => c !== '')) onComplete?.(next.join(''))
      return next
    })
  }

  function handleChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    if (!raw) {
      setChar(i, '')
      return
    }
    const char = raw[raw.length - 1]
    setChar(i, char)
    if (i < LENGTH - 1) focusBox(i + 1)
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (values[i] === '' && i > 0) {
        e.preventDefault()
        setChar(i - 1, '')
        focusBox(i - 1)
      } else {
        setChar(i, '')
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focusBox(i - 1)
    } else if (e.key === 'ArrowRight' && i < LENGTH - 1) {
      focusBox(i + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, LENGTH)
    if (!pasted) return
    const next = Array(LENGTH).fill('')
    for (let idx = 0; idx < pasted.length; idx++) next[idx] = pasted[idx]
    setValues(next)
    const last = Math.min(pasted.length, LENGTH - 1)
    focusBox(last)
    if (pasted.length === LENGTH) onComplete?.(next.join(''))
  }

  return (
    <div className="flex justify-center gap-2.5" role="group" aria-label="Room code">
      {values.map((val, i) => {
        const filled = val !== ''
        return (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el
            }}
            inputMode="text"
            autoCapitalize="characters"
            maxLength={1}
            value={val}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`h-[68px] w-[52px] rounded-2xl border-2 bg-black/30 text-center font-display text-3xl font-bold text-gold caret-brand outline-none transition-all
              ${
                filled
                  ? 'border-brand/70'
                  : 'border-border focus:border-brand focus:shadow-[0_0_22px_rgba(236,27,120,0.55)]'
              }`}
            placeholder="-"
          />
        )
      })}
    </div>
  )
}
