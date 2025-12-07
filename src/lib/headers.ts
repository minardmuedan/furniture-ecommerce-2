import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies, headers } from 'next/headers'

export type CookieOption = Omit<Partial<ResponseCookie>, 'name' | 'value' | 'sameSite' | 'httpOnly' | 'secure'>

const DEFAULT_SECURED_COOKIE_OPTION = {
  path: '/',
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
} as const

export const setCookie = async (key: string, value: string, option?: CookieOption) =>
  (await cookies()).set(key, value, { ...DEFAULT_SECURED_COOKIE_OPTION, ...option })

export const getCookie = async <TName extends string>(name: TName) => (await cookies()).get(name)?.value

export const deleteCookie = async (key: string) => (await cookies()).delete(key)

//user

export async function getIpAddress<T extends boolean>(opt: { throwWhenNull: T }): Promise<T extends true ? string : string | null> {
  const headersStore = await headers()
  const forwardedFor = headersStore.get('x-forwarded-for')
  const ipAddress = (forwardedFor ? forwardedFor.split(',')[0].trim() : headersStore.get('x-real-ip')) ?? null

  if (!ipAddress) {
    if (opt.throwWhenNull) throw 'No valid IP Address'
    return null!
  }
  return ipAddress
}

export async function getUserAgent() {
  const headerStore = await headers()
  return headerStore.get('user-agent')
}
