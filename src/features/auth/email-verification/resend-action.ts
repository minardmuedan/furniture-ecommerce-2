'use server'

import { getCookie, setCookie } from '@/lib/headers'

export const resendEmailVerificationAction = async () => {
  const signup = await getCookie('signup')
  await setCookie('signup', `${signup}`, { maxAge: 60 * 15 })
}
