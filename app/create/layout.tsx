import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Server-side guard for the entire "My Quizzes" / quiz-creation area. Middleware
// already redirects unauthenticated requests, but this is defense-in-depth so a
// session can never be assumed by any page under /create.
export default async function CreateLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectedFrom=/create')
  }

  return <>{children}</>
}
