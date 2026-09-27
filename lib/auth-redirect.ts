import { SITE_URL } from '@/lib/site'

// Password reset must land on a single allowlisted path. Extra query params
// (e.g. /auth/callback?next=...) are often rejected by Supabase Redirect URLs.
export function passwordResetRedirectTo(): string {
  return `${publicAppOrigin()}/auth/update-password`
}

export function signupEmailRedirectTo(): string {
  const proxy =
    process.env.NODE_ENV !== 'production'
      ? process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
      : undefined
  if (proxy) {
    const sep = proxy.includes('?') ? '&' : '?'
    return `${proxy}${sep}next=${encodeURIComponent('/create')}`
  }
  return `${publicAppOrigin()}/auth/callback?next=${encodeURIComponent('/create')}`
}

function publicAppOrigin(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) return origin
  }
  return SITE_URL
}
