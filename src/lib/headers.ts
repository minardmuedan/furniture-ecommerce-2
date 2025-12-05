import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies, headers } from 'next/headers'

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

type SessionValue<TName> = TName extends 'session' ? string : string | undefined
export async function getCookie<TName extends string>(name: TName): Promise<SessionValue<TName>> {
  const cookieStore = await cookies()
  const value = cookieStore.get(name)?.value
  if (name === 'session' && !value) throw new Error('No Session Id')
  return value as SessionValue<TName>
}

export async function deleteCookie(key: string) {
  const cookieStore = await cookies()
  cookieStore.delete(key)
}

//users

export function getIpAddress(throwWhenNull?: false): Promise<string | null>
export function getIpAddress(throwWhenNull: true): Promise<string>
export async function getIpAddress(throwWhenNull?: boolean) {
  const headersStore = await headers()
  const forwardedFor = headersStore.get('x-forwarded-for')
  const ipAddress = (forwardedFor ? forwardedFor.split(',')[0].trim() : headersStore.get('x-real-ip')) ?? null
  if (!ipAddress) {
    if (throwWhenNull) throw 'No valid IP Address'
    return null
  }
  return ipAddress
}

export async function getUserAgent() {
  const headerStore = await headers()
  return headerStore.get('user-agent')
}
