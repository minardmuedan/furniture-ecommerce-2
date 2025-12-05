import { createSessionDb } from '@/db/utils/sessions'
import { FIFTEEN_MINUTES_IN_MS, FIFTEEN_MINUTES_IN_SECONDS, MONTH_IN_MS, MONTH_IN_SECONDS, SESSION_COOKIE_KEY } from '../data-const'
import { getIpAddress, getUserAgent, setCookie } from '../headers'

export const setSession = async (sessionId: string, userId: string, isTemporary?: boolean) => {
  const now = Date.now()
  const ipAddress = await getIpAddress(true)
  const userAgent = await getUserAgent()

  const expiresAt = new Date(isTemporary ? now + FIFTEEN_MINUTES_IN_MS : now + MONTH_IN_MS)
  await createSessionDb({ id: sessionId, userId, ipAddress, userAgent, expiresAt })

  const coookieMaxAge = isTemporary ? FIFTEEN_MINUTES_IN_SECONDS : MONTH_IN_SECONDS
  await setCookie(SESSION_COOKIE_KEY, sessionId, { maxAge: coookieMaxAge })
}
