export function isSupabaseAuthCookie(name: string): boolean {
  return name.startsWith('sb-') && name.includes('auth-token')
}

export function clearBrowserAuthCookies() {
  if (typeof document === 'undefined') return
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim()
    if (!name || !isSupabaseAuthCookie(name)) continue
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
  }
}
