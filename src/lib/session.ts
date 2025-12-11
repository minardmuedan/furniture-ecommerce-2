import { createSessionDb, getSessionDb, updateSessionDb } from '@/db/utils/sessions'
import { DAY_IN_MS, THIRTY_MINUTES_IN_MS, WEEK_IN_MS, WEEK_IN_SECONDS } from './data-const'
import { deleteCookie, getCookie, getIpAddress, getUserAgent, setCookie } from './headers'
import { redis } from './redis'
import { generateSecureRandomString } from './utils'

export const SESSION_COOKIE_KEY = 'session'

export const createSession = async (userId: string, temporaryOnly?: boolean) => {
  const now = Date.now()

  const id = generateSecureRandomString()
  const ipAddress = await getIpAddress({ throwWhenNull: true })
  const userAgent = await getUserAgent()

  const ageInMs = temporaryOnly ? THIRTY_MINUTES_IN_MS : WEEK_IN_MS
  const expiresAt = new Date(now + ageInMs)

  await createSessionDb({ id, userId, ipAddress, userAgent, expiresAt })

  await setCookie(SESSION_COOKIE_KEY, id, { maxAge: ageInMs / 1000 })
  return id
}

export const validateSession = async () => {
  const sessionId = await getCookie(SESSION_COOKIE_KEY)
  if (!sessionId) return null

  const redisSession = await redis.get(`session:${sessionId}`).catch(() => null)
  if (redisSession) return redisSession

  const dbSession = await getSessionDb(sessionId)
  if (!dbSession || dbSession.logoutedAt || !dbSession.user.emailVerified) {
    if (!dbSession || dbSession.logoutedAt) await deleteCookie(SESSION_COOKIE_KEY).catch(() => {})
    return null
  }

  const now = Date.now()
  const sessionExpiresAt = dbSession.expiresAt.getTime()

  if (now > sessionExpiresAt) {
    await updateSessionDb(sessionId, { logoutedAt: new Date() })
    await deleteCookie(SESSION_COOKIE_KEY).catch(() => {})
    return null
  }

  const isPastHalfWeek = now > sessionExpiresAt - WEEK_IN_MS / 2
  if (isPastHalfWeek) {
    const newExpiresAt = new Date(now + WEEK_IN_MS)
    await updateSessionDb(sessionId, { expiresAt: newExpiresAt })
    await setCookie(SESSION_COOKIE_KEY, sessionId, { maxAge: WEEK_IN_SECONDS }).catch(() => {})
    console.log(`Session ${sessionId} refreshed for user ${dbSession.userId}`)
  }

  const clientSession = { sessionId: dbSession.id, user: { username: dbSession.user.username, email: dbSession.user.email } }
  await redis.set(`session:${sessionId}`, clientSession, { expiration: { type: 'PX', value: DAY_IN_MS } })
  return clientSession
}

export const invalidateSession = async () => {
  const sessionId = await getCookie(SESSION_COOKIE_KEY)
  if (sessionId) await updateSessionDb(sessionId, { logoutedAt: new Date() })
  await redis.del(`session:${sessionId}`).catch(() => {})
  await deleteCookie(SESSION_COOKIE_KEY)
}
