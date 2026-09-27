const MIN_PASSWORD = 6

export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Invalid email or password.'
  if (m.includes('email not confirmed'))
    return 'Please confirm your email address before signing in. Check your inbox.'
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'An account with this email already exists. Try signing in instead.'
  if (m.includes('password') && (m.includes('at least') || m.includes('weak') || m.includes('short')))
    return `Password must be at least ${MIN_PASSWORD} characters.`
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a moment and try again.'
  if (m.includes('unable to validate email') || m.includes('invalid email'))
    return 'Please enter a valid email address.'
  return message
}
