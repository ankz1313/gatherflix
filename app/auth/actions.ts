'use server'

import { redirect } from 'next/navigation'
import { friendlyAuthError } from '@/lib/auth-errors'
import { clearServerAuthCookies } from '@/lib/supabase/auth-cookies.server'
import { createServerSupabase } from '@/lib/supabase/server'

function safeNext(value: string | null): string {
  return value && value.startsWith('/') ? value : '/create'
}

export async function signInWithPasswordAction(input: {
  email: string
  password: string
  next?: string | null
}): Promise<{ error: string } | void> {
  // Drop leftover chunked session cookies from the last sign-out. Those
  // reassemble into a broken token and make a valid password look wrong.
  await clearServerAuthCookies()
  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  })
  if (error) {
    return { error: friendlyAuthError(error.message) }
  }
  redirect(safeNext(input.next ?? null))
}

export async function signOutAction() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut({ scope: 'local' })
  await clearServerAuthCookies()
  redirect('/')
}
