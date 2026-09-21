'use server'

export type ContactState = {
  sent: boolean
  error: string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE = 4000

export async function sendFeedback(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const honeypot = String(formData.get('company') ?? '').trim()
  if (honeypot) {
    return { sent: true, error: null }
  }

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (name.length < 2 || name.length > 80) {
    return { sent: false, error: 'Please enter your name.' }
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { sent: false, error: 'Please enter a valid email so we can reply.' }
  }
  if (message.length < 10) {
    return { sent: false, error: 'Tell us a bit more — at least a sentence.' }
  }
  if (message.length > MAX_MESSAGE) {
    return { sent: false, error: 'That note is a bit long. Try under 4000 characters.' }
  }

  const apiKey = process.env.RESEND_API_KEY
  const inbox = process.env.CONTACT_INBOX
  const from = process.env.CONTACT_FROM ?? 'GatherFlix <noreply@gatherflix.app>'

  if (!apiKey || !inbox) {
    console.error('[contact] RESEND_API_KEY or CONTACT_INBOX is not set')
    return { sent: false, error: 'Feedback is not set up yet. Please try again later.' }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [inbox],
      reply_to: email,
      subject: `GatherFlix feedback from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, '', message].join('\n'),
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[contact] Resend failed:', res.status, body.slice(0, 200))
    return { sent: false, error: 'Could not send that just now. Please try again.' }
  }

  return { sent: true, error: null }
}
