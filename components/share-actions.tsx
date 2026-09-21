'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

type ShareActionsProps = {
  url: string
  text: string
  instagramHint?: boolean
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.01 3.66 9.16 8.44 9.91v-7.01H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.9 8.44-9.94z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.995-9.135L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function fallbackCopy(value: string) {
  const input = document.createElement('textarea')
  input.value = value
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.top = '0'
  input.style.left = '0'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.focus()
  input.select()
  input.setSelectionRange(0, value.length)
  const ok = document.execCommand('copy')
  document.body.removeChild(input)
  if (!ok) throw new Error('Copy failed')
}

export function ShareActions({ url, text, instagramHint = true }: ShareActionsProps) {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const twitter = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`

  async function copyLink() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        fallbackCopy(url)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      try {
        fallbackCopy(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2200)
      } catch {
        setCopied(false)
      }
    }
  }

  const iconBtn =
    'inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => void copyLink()}
          className={iconBtn}
          aria-label={copied ? 'Link copied' : 'Copy link'}
          title={copied ? 'Copied' : 'Copy link'}
        >
          {copied ? (
            <Check className="size-6 text-gold" strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <Link2 className="size-6" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={iconBtn}
          aria-label="Share on Facebook"
          title="Facebook"
        >
          <FacebookIcon className="size-6" />
        </a>
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={iconBtn}
          aria-label="Share on X"
          title="X / Twitter"
        >
          <XIcon className="size-[1.15rem]" />
        </a>
      </div>
      {copied && (
        <p className="text-xs font-medium text-gold" aria-live="polite">
          Copied {url}
        </p>
      )}
      {instagramHint && !copied && (
        <p className="text-xs text-muted-foreground">
          Instagram does not let websites post for you. Copy the link, then paste into a Story or
          post.
        </p>
      )}
    </div>
  )
}
