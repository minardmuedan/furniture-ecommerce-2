import { NextRequest, NextResponse } from 'next/server'
import { FIFTEEN_MINUTES_IN_SECONDS, SESSION_COOKIE_KEY } from './lib/data-const'
import { generateSecureRandomString } from './lib/utils'
import { redis } from './lib/redis'
import { getSession } from './lib/session/get-session'

const GUEST_PATH = ['/login', '/signup', '/forgot-password']
const AUTH_PATH = ['/auth']

export default async function proxy(req: NextRequest) {
  const { nextUrl } = req
  const res = NextResponse.next()

  let sessionId = req.cookies.get(SESSION_COOKIE_KEY)?.value
  if (!sessionId) {
    sessionId = generateSecureRandomString()
    redis.set(`session:${sessionId}`, { session: null }, { expiration: { type: 'EX', value: FIFTEEN_MINUTES_IN_SECONDS } })
    res.cookies.set(SESSION_COOKIE_KEY, sessionId)
  }

  if (AUTH_PATH.includes(nextUrl.pathname)) {
    const session = await getSession(sessionId)
    if (!session) return NextResponse.rewrite(new URL('/signup', nextUrl))
  }
  return res
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'] }
