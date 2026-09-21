'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, Share2 } from 'lucide-react'

type ShareActionsProps = {
  url: string
  text: string
  instagramHint?: boolean
}

export function ShareActions({ url, text, instagramHint = true }: ShareActionsProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const twitter = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  async function nativeShare() {
    if (!canNativeShare) return
    try {
      await navigator.share({ title: text, text, url })
      setOpen(false)
    } catch {
      // User cancelled or share is unavailable.
    }
  }

  const btn =
    'inline-flex items-center justify-center rounded-full border border-border bg-secondary/70 px-4 py-2.5 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent'
  const item =
    'flex w-full items-center rounded-xl px-3 py-2.5 text-left font-display text-sm font-bold text-foreground transition-colors hover:bg-accent'

  return (
    <div className="flex flex-col gap-2">
      <div className="relative" ref={rootRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={btn}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <Share2 className="mr-2 size-4" aria-hidden="true" />
          Share
        </button>
        {open && (
          <div
            role="menu"
            className="absolute top-full left-0 z-20 mt-2 min-w-[13.5rem] rounded-2xl border border-border bg-card p-1.5 shadow-[0_18px_50px_-28px_rgb(0_0_0/0.55)]"
          >
            <button type="button" role="menuitem" onClick={() => void copyLink()} className={item}>
              <Copy className="mr-2 size-4" aria-hidden="true" />
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className={item}
              onClick={() => setOpen(false)}
            >
              X / Twitter
            </a>
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className={item}
              onClick={() => setOpen(false)}
            >
              Facebook
            </a>
            {canNativeShare && (
              <button type="button" role="menuitem" onClick={() => void nativeShare()} className={item}>
                More apps
              </button>
            )}
          </div>
        )}
      </div>
      {instagramHint && (
        <p className="text-xs text-muted-foreground">
          Instagram does not let websites post for you. Open Share, copy the link, then paste into a
          Story or post.
        </p>
      )}
    </div>
  )
}
