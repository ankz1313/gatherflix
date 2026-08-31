import { createClient } from '@supabase/supabase-js'

// Anon client for public reads (published quizzes, room lookups, lobby lists).
// RLS is enforced — this client only sees what the anon policies allow.
export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase URL or anon key is not configured.')
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

// Service-role client for trusted server-side writes where we control the
// input (e.g. generating a unique room code, seeding a player row). Never
// import this into client components — it bypasses RLS.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Supabase URL or service role key is not configured.')
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
