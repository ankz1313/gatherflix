'use client'

import { useState } from 'react'
import { Copy, Share2 } from 'lucide-react'

type ShareActionsProps = {
  url: string
  text: string
  instagramHint?: boolean
}

export function ShareActions({ url, text, instagramHint = true }: ShareActionsProps) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const twitter = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`.trim())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  async function nativeShare() {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: text, text, url })
        return
      } catch {
        // User cancelled or share is unavailable.
      }
    }
    await copyLink()
  }

  const btn =
    'inline-flex items-center justify-center rounded-full border border-border bg-secondary/70 px-4 py-2.5 font-display text-sm font-bold text-foreground transition-colors hover:bg-accent'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => void nativeShare()} className={btn}>
          <Share2 className="mr-2 size-4" aria-hidden="true" />
          Share
        </button>
        <a href={twitter} target="_blank" rel="noopener noreferrer" className={btn}>
          X / Twitter
        </a>
        <a href={facebook} target="_blank" rel="noopener noreferrer" className={btn}>
          Facebook
        </a>
        <button type="button" onClick={() => void copyLink()} className={btn}>
          <Copy className="mr-2 size-4" aria-hidden="true" />
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      {instagramHint && (
        <p className="text-xs text-muted-foreground">
          Instagram does not let websites post for you. Use Share or Copy link, then paste into a
          Story or post.
        </p>
      )}
    </div>
  )
}
