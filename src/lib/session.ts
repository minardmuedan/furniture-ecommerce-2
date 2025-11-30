import { createSessionDb, deleteSessionDb, getSessionDb, updateSessionDb } from '@/db/utils/sessions'
import { deleteCookie, getCookie, getIpAddress, getUserAgent, setCookie } from './headers'
import { generateSecureRandomString } from './utils'

const SESSION_COOKIE_KEY = 'session'
const MONTH_IN_SECONDS = 60 * 60 * 24 * 30
const FITEEN_MINUTES_IN_SECONDS = 60 * 15

export const createSession = async (userId: string, isTemporary?: boolean) => {
  const now = Date.now()
  const sessionId = generateSecureRandomString()
  const ipAddress = await getIpAddress(true)
  const userAgent = await getUserAgent()

  const expiresAt = new Date(isTemporary ? now + 1000 * FITEEN_MINUTES_IN_SECONDS : now + 1000 * MONTH_IN_SECONDS)
  await createSessionDb({ id: sessionId, userId, ipAddress, userAgent, expiresAt })

  const coookieMaxAge = isTemporary ? FITEEN_MINUTES_IN_SECONDS : MONTH_IN_SECONDS
  await setCookie(SESSION_COOKIE_KEY, sessionId, { maxAge: coookieMaxAge })
}

export const getSession = async () => {
  const sessionId = await getCookie(SESSION_COOKIE_KEY)
  if (!sessionId) return null

  const sessionData = await getSessionDb(sessionId)
  if (!sessionData?.user || !sessionData.user.emailVerified) return null

  if (Date.now() > sessionData.expiresAt.getTime()) await deleteSession(sessionId).catch(() => {})

  // is past half month
  if (Date.now() + MONTH_IN_SECONDS / 2 > sessionData.expiresAt.getTime()) {
    await updateSessionDb(sessionId, { expiresAt: new Date(Date.now() + 1000 * MONTH_IN_SECONDS) })
    await setCookie(SESSION_COOKIE_KEY, sessionId, { maxAge: MONTH_IN_SECONDS }).catch(() => {})
  }

  return sessionData
}

export const deleteSession = async (id?: string) => {
  deleteCookie(SESSION_COOKIE_KEY)

  const sessionId = id || (await getCookie(SESSION_COOKIE_KEY))
  if (sessionId) await deleteSessionDb(sessionId)
}
