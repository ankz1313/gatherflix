import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

const OTP_TYPES: EmailOtpType[] = [
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]

function isOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (OTP_TYPES as string[]).includes(value)
}

// Email confirm / password reset land here with either a PKCE ?code= or a
// token_hash from the mail template. Session cookies are set by the SSR client.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const typeParam = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'
  const target = next.startsWith('/') ? next : '/'
  const supabase = await createServerSupabase()

  if (token_hash && isOtpType(typeParam)) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(`${origin}${target}`)
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${target}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
