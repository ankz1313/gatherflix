import { cookies } from 'next/headers'
import { isSupabaseAuthCookie } from '@/lib/supabase/auth-cookies'

export async function clearServerAuthCookies() {
  const store = await cookies()
  for (const cookie of store.getAll()) {
    if (!isSupabaseAuthCookie(cookie.name)) continue
    store.set(cookie.name, '', { path: '/', maxAge: 0 })
  }
}
