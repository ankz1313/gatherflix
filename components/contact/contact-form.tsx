'use client'

import { useActionState } from 'react'
import { sendFeedback, type ContactState } from '@/app/contact/actions'

const inputClass =
  'h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]'

const initial: ContactState = { sent: false, error: null }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendFeedback, initial)

  if (state.sent) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm leading-relaxed text-gold"
      >
        Got it — thanks for writing in. We read every note and will reply if we need more from you.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="font-display text-sm font-bold tracking-tight">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="font-display text-sm font-bold tracking-tight">
          Your email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@email.com"
          className={inputClass}
        />
        <p className="text-xs text-muted-foreground">We only use this to reply. It is not shown publicly.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="font-display text-sm font-bold tracking-tight">
          Feedback
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={7}
          placeholder="What worked, what broke, what you wish existed…"
          className="min-h-[10rem] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-[1.05rem] text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-white/[0.06]"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-14 w-full rounded-full bg-gold font-display text-lg font-bold text-gold-foreground shadow-[0_0_35px_-5px_var(--gold)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send feedback'}
      </button>
    </form>
  )
}
