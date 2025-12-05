'use server'

import { updateUserDb } from '@/db/utils/users'
import { FIFTEEN_MINUTES_IN_SECONDS } from '@/lib/data-const'
import { deleteCookie, getCookie } from '@/lib/headers'
import { signJWTToken, verifyJWTToken } from '@/lib/jwt-token'
import { mailerSendEmailVerificationToken } from '@/lib/mailer'
import { redis } from '@/lib/redis'
import { createServerAction, CustomError } from '@/lib/server-action'
import { generateSecureRandomString } from '@/lib/utils'
import { verificationTokenSchema } from '../schema'

export const verifyEmailAction = createServerAction(verificationTokenSchema)
  .ratelimit({ key: 'verify_email', capacity: 5, refillRate: 1, refillPerSeconds: 10 })
  .handle(async ({ jwtToken }) => {
    const { payload } = await verifyJWTToken(jwtToken)
    if (!payload) throw new CustomError('not_found', 'Verification Token not found!')

    const verificationId = payload.verificationId

    const verificationData = await redis.get(`verification:email:${verificationId}`)
    if (!verificationData) throw new CustomError('not_found', 'Verification Token not found!')

    if (payload.token !== verificationData.token) throw new CustomError('not_found', 'Verification Token not found!')
    const { sessionId, user } = verificationData

    await updateUserDb(user.id, { emailVerified: new Date() })
    await redis.del(`verification:email:${verificationId}`)

    await redis.publish('EMAIL_VERIFICATION_CHANNEL', {
      sessionId,
      user: { email: user.email, username: user.username },
      message: `Email verified successful — welcome, ${user.username}`,
    })

    const isSameDevice = (await getCookie('signup')) === verificationId
    const message = `Email verified successful — ${isSameDevice ? `welcome, ${verificationData.user.username}` : `Try to login`}  `

    await deleteCookie('signup')
    return { message, redirectTo: isSameDevice ? '/' : '/login' } as const
  })

export const resendEmailVerificationAction = createServerAction()
  .ratelimit({
    key: 'resend-email-verification',
    capacity: 1,
    refillRate: 1,
    refillPerSeconds: 30,
  })
  .handle(async () => {
    const verificationId = await getCookie('signup')
    if (!verificationId) throw new CustomError('not_found', 'Verification Token not found!')

    const verificationData = await redis.get(`verification:email:${verificationId}`)
    if (!verificationData) throw new CustomError('not_found', 'Verification Token not found!')

    const sessionId = verificationData.sessionId
    const newToken = generateSecureRandomString()

    await redis.set(
      `verification:email:${verificationId}`,
      { sessionId, token: newToken, user: verificationData.user },
      { expiration: { type: 'EX', value: FIFTEEN_MINUTES_IN_SECONDS } },
    )

    const jwtToken = await signJWTToken({ verificationId, token: newToken })
    await mailerSendEmailVerificationToken(verificationData.user.email, jwtToken)

    return { message: 'Email verification sent!' }
  })

export const rejectSignupVerificationAction = async () => {
  await deleteCookie('signup')
  await deleteCookie('session')
}
