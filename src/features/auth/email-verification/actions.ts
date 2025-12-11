'use server'

import { updateUserDb } from '@/db/utils/users'
import { FIFTEEN_MINUTES_IN_SECONDS } from '@/lib/data-const'
import { deleteCookie, getCookie, setCookie } from '@/lib/headers'
import { mailerSendEmailVerificationToken } from '@/lib/mailer'
import { createServerAction, CustomError } from '@/lib/server-action'
import { createVerificationToken, deleteVerificationToken, getVerificationToken, verifyVerificationToken } from '../helpers/token'
import { jwtTokenSchema } from '../schema'
import { SESSION_COOKIE_KEY } from '@/lib/session'
import { redis } from '@/lib/redis'

export const verifyEmailAction = createServerAction(jwtTokenSchema)
  .ratelimit({ key: 'verify-email', capacity: 100, refillRate: 1, refillPerSeconds: 30 })
  .handle(async ({ jwtToken }) => {
    const { email, token } = await verifyVerificationToken(jwtToken)
    const { sessionId, user } = await getVerificationToken('email', email, token)

    await updateUserDb(user.id, { emailVerified: new Date() })

    const authedMessage = `Email Verified Successfully! Welcome ${user.username}.`
    await redis.publish('EMAIL_VERIFICATION_CHANNEL', { sessionId, message: authedMessage })

    await deleteVerificationToken('email', email)
    await deleteCookie('signup')

    const isSameDevice = (await getCookie(SESSION_COOKIE_KEY)) === sessionId
    return {
      message: isSameDevice ? authedMessage : 'Email Verified Successfully! Try to login',
      redirectTo: isSameDevice ? ('/login' as const) : undefined,
    }
  })

export const resendEmailVerificationAction = createServerAction()
  .ratelimit({ key: 'resend-email-verification', capacity: 1, refillRate: 1, refillPerSeconds: 30 })
  .handle(async () => {
    const email = await getCookie('signup')
    if (!email) throw new CustomError('not_found', 'Verification Token not found!')

    const { sessionId, user } = await getVerificationToken('email', email)

    const { jwtToken } = await createVerificationToken('email', { sessionId, user })
    await mailerSendEmailVerificationToken(user.email, jwtToken)
    await setCookie('signup', email, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })

export const backToSignupAction = async () => {
  await deleteCookie('signup')
  await deleteCookie(SESSION_COOKIE_KEY)
}
