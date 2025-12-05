import { deleteSessionDb, getSessionDb, updateSessionDb } from '@/db/utils/sessions'
import type { Session } from '@/types/session'
import { DAY_IN_MS, FIFTEEN_MINUTES_IN_SECONDS, MONTH_IN_MS, MONTH_IN_SECONDS, SESSION_COOKIE_KEY } from '../data-const'
import { deleteCookie, setCookie } from '../headers'
import { redis } from '../redis'

export const getSession = async (sessionId: string): Promise<Session | null> => {
  if (!sessionId) return null

  const redisSession = await redis.get(`session:${sessionId}`)
  if (redisSession) return redisSession.session

  const dbSession = await getSessionDb(sessionId)
  if (!dbSession || !dbSession.user.emailVerified) {
    redis.set(`session:${sessionId}`, { session: null }, { expiration: { type: 'EX', value: FIFTEEN_MINUTES_IN_SECONDS } })
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

  redis.set(
    `session:${sessionId}`,
    { session: dbSession },
    { expiration: { type: 'PXAT', value: Math.min(sessionExpiresAt, now + DAY_IN_MS) } },
  )
  return dbSession
}
