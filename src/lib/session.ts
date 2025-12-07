import { createSessionDb, deleteSessionDb, getSessionDb, updateSessionDb } from '@/db/utils/sessions'
import { DAY_IN_MS, FIFTEEN_MINUTES_IN_MS, FIFTEEN_MINUTES_IN_SECONDS, MONTH_IN_MS, MONTH_IN_SECONDS } from './data-const'
import { deleteCookie, getCookie, getIpAddress, getUserAgent, setCookie } from './headers'
import { redis } from './redis'
import { generateSecureRandomString } from './utils'

export const SESSION_COOKIE_KEY = 'session'

export const setSession = async (userId: string, isTemporary?: boolean) => {
  const sessionId = generateSecureRandomString()
  const now = Date.now()
  const ipAddress = await getIpAddress({ throwWhenNull: true })
  const userAgent = await getUserAgent()

  const expiresAt = new Date(isTemporary ? now + FIFTEEN_MINUTES_IN_MS : now + MONTH_IN_MS)
  await createSessionDb({ id: sessionId, userId, ipAddress, userAgent, expiresAt })

  const coookieMaxAge = isTemporary ? FIFTEEN_MINUTES_IN_SECONDS : MONTH_IN_SECONDS
  await setCookie(SESSION_COOKIE_KEY, sessionId, { maxAge: coookieMaxAge })
}

export const getSession = async () => {
  console.log('get session fn runs')
  await new Promise((res) => setTimeout(res, 8000))

  const sessionId = await getCookie(SESSION_COOKIE_KEY)
  console.log('get session fn ends')

  if (!!true) return { user: { email: 'menard@gmasd.co', username: 'menard' } }

  if (!sessionId) return null

  const redisSession = await redis.get(`session:${sessionId}`)
  if (redisSession) return redisSession

  const dbSession = await getSessionDb(sessionId)
  if (!dbSession || !dbSession.user.emailVerified || dbSession.logoutedAt) {
    redis.set(`session:${sessionId}`, null, { expiration: { type: 'EX', value: FIFTEEN_MINUTES_IN_SECONDS } })
    return null
  }

  const now = Date.now()
  const sessionExpiresAt = dbSession.expiresAt.getTime()

  if (now > sessionExpiresAt) {
    await deleteSessionDb(sessionId)
    await deleteCookie(SESSION_COOKIE_KEY).catch(() => {})
  }

  const isPastHalfMonth = now > sessionExpiresAt - MONTH_IN_MS / 2
  if (isPastHalfMonth) {
    await updateSessionDb(sessionId, { expiresAt: new Date(now + MONTH_IN_MS) })
    await setCookie(SESSION_COOKIE_KEY, sessionId, { maxAge: MONTH_IN_SECONDS }).catch(() => {})
  }

  await redis.set(`session:${sessionId}`, dbSession, { expiration: { type: 'PX', value: DAY_IN_MS } })
  return dbSession
}

export const deleteSession = async () => {
  const sessionId = await getCookie(SESSION_COOKIE_KEY)
  if (sessionId) await updateSessionDb(sessionId, { logoutedAt: new Date() })
  await redis.del(`session:${sessionId}`)
  await deleteCookie(SESSION_COOKIE_KEY).catch(() => {})
}
