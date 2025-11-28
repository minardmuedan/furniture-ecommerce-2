import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

export type CookieOption = Omit<Partial<ResponseCookie>, 'name' | 'value' | 'sameSite' | 'httpOnly' | 'secure'>

const DEFAULT_SECURED_COOKIE_OPTION = {
  path: '/',
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
} as const

export async function setCookie(key: string, value: string, option?: CookieOption) {
  const cookieStore = await cookies()
  cookieStore.set(key, value, { ...DEFAULT_SECURED_COOKIE_OPTION, ...option })
}

export async function getCookie(name: string) {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}
