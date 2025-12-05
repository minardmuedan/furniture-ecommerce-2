import { deleteSessionDb } from '@/db/utils/sessions'
import { deleteCookie, getCookie } from '../headers'
import { SESSION_COOKIE_KEY } from '../data-const'
import { redis } from '../redis'

export const deleteSession = async (sessionId: string) => {
  deleteCookie(SESSION_COOKIE_KEY).catch(() => {})
  deleteSessionDb(sessionId)
  redis.del(`session:${sessionId}`)
}
