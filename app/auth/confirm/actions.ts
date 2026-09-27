'use server'

import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

const OTP_TYPES: EmailOtpType[] = [
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]

function isOtpType(value: string): value is EmailOtpType {
  return (OTP_TYPES as string[]).includes(value)
}

export async function confirmEmail(formData: FormData) {
  const token_hash = String(formData.get('token_hash') ?? '')
  const type = String(formData.get('type') ?? '')
  const next = String(formData.get('next') ?? '')
  const target = next.startsWith('/')
    ? next
    : type === 'recovery'
      ? '/auth/update-password'
      : '/'

  if (!token_hash || !isOtpType(type)) {
    redirect('/auth/error')
  }

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash })
  if (error) {
    redirect('/auth/error')
  }

  redirect(target)
}
