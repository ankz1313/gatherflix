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

// Email templates link here with token_hash so confirm/reset works even if
// the mail is opened in a different browser than the one used to sign up.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const typeParam = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'
  const target = next.startsWith('/') ? next : '/'

  if (token_hash && isOtpType(typeParam)) {
    const supabase = await createServerSupabase()
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam,
      token_hash,
    })
    if (!error) {
      return NextResponse.redirect(`${origin}${target}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
