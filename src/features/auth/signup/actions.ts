'use server'

import { deleteUserSessionsDb } from '@/db/utils/sessions'
import { createUserDb, getUserByEmailDb, updateUserDb } from '@/db/utils/users'
import { FIFTEEN_MINUTES_IN_SECONDS, THIRTY_MINUTES_IN_MS } from '@/lib/data-const'
import { deleteCookie, getCookie, setCookie } from '@/lib/headers'
import { mailerSendEmailVerificationToken } from '@/lib/mailer'
import { redis } from '@/lib/redis'
import { createServerAction, CustomError } from '@/lib/server-actions/server-action'
import { createSession, SESSION_COOKIE_KEY } from '@/lib/session'
import { generateSecureRandomString } from '@/lib/utils'
import { hash } from 'bcryptjs'
import type { Route } from 'next'
import { createVerificationToken, deleteVerificationToken, getVerificationToken, getVerificationTokenByJwtToken } from '../lib/auth-token'
import { jwtTokenSchema, signupSchema } from '../lib/schema'

export const signupAction = createServerAction(signupSchema)
  .ratelimit({ key: 'signup', capacity: 5, refillRate: 5, refillPerSeconds: 30 })
  .handle(async ({ username, email, password }, throwFieldError) => {
    const hashedPassword = await hash(password, 10)
    const existingUser = await getUserByEmailDb(email)

    let userId = generateSecureRandomString()
    if (existingUser) {
      if (existingUser.emailVerified) throwFieldError({ email: 'Email already in use' })

      userId = existingUser.id
      await updateUserDb(userId, { username, password: hashedPassword })
      await deleteUserSessionsDb(userId)
    } else await createUserDb({ id: userId, username, email, password: hashedPassword })

    const sessionId = await createSession(userId, true)
    await redis.set(`session:${sessionId}`, { session: null }, { expiration: { type: 'PX', value: THIRTY_MINUTES_IN_MS } })
    const { jwtToken } = await createVerificationToken('email', email, { sessionId, user: { id: userId, username } })

    await mailerSendEmailVerificationToken(email, jwtToken)
    await setCookie('signup', email, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })

export const backToSignupAction = async () => {
  await deleteCookie('signup')
  await deleteCookie(SESSION_COOKIE_KEY)
}

export const resendEmailVerificationAction = createServerAction()
  .ratelimit({ key: 'resend-email-verification', capacity: 1, refillRate: 1, refillPerSeconds: 30 })
  .handle(async () => {
    const email = await getCookie('signup')
    if (!email) throw new CustomError('not_found', 'Verification Token not found!')

    const { sessionId, user } = await getVerificationToken('email', email)
    const { jwtToken } = await createVerificationToken('email', email, { sessionId, user })

    await mailerSendEmailVerificationToken(email, jwtToken)
    await setCookie('signup', email, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })

export const verifyEmailAction = createServerAction(jwtTokenSchema)
  .ratelimit({ key: 'verify-email', capacity: 100, refillRate: 1, refillPerSeconds: 30 })
  .handle<{ message: string; redirectTo: Route }>(async ({ jwtToken }) => {
    const { sessionId, email, user } = await getVerificationTokenByJwtToken('email', jwtToken)

    await updateUserDb(user.id, { emailVerified: new Date() })
    await redis.del(`session:${sessionId}`)

    const authedMessage = `Email verified successfully! Welcome ${user.username}.`
    await redis.publish('EMAIL_VERIFICATION_CHANNEL', { sessionId, message: authedMessage })

    await deleteVerificationToken('email', email)
    await deleteCookie('signup')

    const isSameDevice = (await getCookie(SESSION_COOKIE_KEY)) === sessionId
    return {
      message: isSameDevice ? authedMessage : 'Email verified successfully! Try to login',
      redirectTo: !isSameDevice ? '/login' : '/',
    }
  })
