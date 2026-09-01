import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Paths that require an authenticated user. Anything under these prefixes
// redirects to /login when there is no session.
const PROTECTED_PREFIXES = ['/create', '/host/room']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // With Fluid compute, don't put this client in a global variable. Always
  // create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { secure: process.env.NODE_ENV === 'production' },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run code between createServerClient and supabase.auth.getUser().
  // A simple mistake could make it very hard to debug issues with users being
  // randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    // Preserve the original path AND query (e.g. ?quiz=...) so the user lands
    // back on the exact quiz they tried to host after signing in.
    const from = `${pathname}${request.nextUrl.search}`
    url.pathname = '/login'
    url.search = ''
    url.searchParams.set('redirectedFrom', from)
    return NextResponse.redirect(url)
  }

  // IMPORTANT: return the supabaseResponse object as-is to keep the browser and
  // server session cookies in sync.
  return supabaseResponse
}
