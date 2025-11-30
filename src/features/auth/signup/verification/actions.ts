'use server'

import { updateUserDb } from '@/db/utils/users'
import {
  deleteVerificationTokenDb,
  getVerificationTokenByTokenDb,
  getVerificationTokenDb,
  updateVerificationTokenDb,
} from '@/db/utils/verifications'
import { deleteCookie, getCookie } from '@/lib/headers'
import { verifyJWTToken } from '@/lib/jwt-token'
import { createServerAction, CustomError } from '@/lib/server-action'
import { serverSocket } from '@/socket/server-socket'
import { verificationTokenSchema } from '../schema'

const socket_secret = process.env.SOCKET_SECRET!

export const verifyEmailAction = createServerAction(verificationTokenSchema)
  .ratelimit({ key: 'verify_email', maxAttempt: 5, refill: { attempt: 5, perSeconds: 30 } })
  .handle(async ({ jwtToken }) => {
    await new Promise((res) => setTimeout(res, 5000))

    const jwt = await verifyJWTToken(jwtToken)
    if (!jwt.token) throw new CustomError('not_found', 'Verification Token not found!')

    const verificationTokenData = await getVerificationTokenByTokenDb(jwt.token, 'email-verification')
    if (!verificationTokenData) throw new CustomError('not_found', 'Verification Token not found!')
    if (Date.now() > verificationTokenData.expiresAt.getTime()) throw new CustomError('expired', 'Verification Token is expired!')

    await updateUserDb(verificationTokenData.userId, { emailVerified: new Date() })
    await deleteVerificationTokenDb(verificationTokenData.id)

    serverSocket.emit('server-email-verification', socket_secret, {
      verificationId: verificationTokenData.id,
      message: `Email verified successful — welcome, ${verificationTokenData.user.username}`,
    })

    const isSameDevice = (await getCookie('signup')) === verificationTokenData.id
    await deleteCookie('signup')

    const message = `Email verified successful — ${isSameDevice ? `welcome, ${verificationTokenData.user.username}` : `Try to login`}  `
    return { message, redirect: isSameDevice ? '/' : '/login' }
  })

export const resendEmailVerificationAction = createServerAction()
  .ratelimit({
    key: 'resend-email-verification',
    maxAttempt: 1,
    refill: { attempt: 1, perSeconds: 30 },
  })
  .handle(async () => {
    const verificationId = await getCookie('signup')
    if (!verificationId) throw new CustomError('not_found', 'Verification Token not found!')

    const verificationTokenData = await getVerificationTokenDb(verificationId, 'email-verification')
    if (!verificationTokenData) throw new CustomError('not_found', 'Verification Token not found!')
    if (Date.now() > verificationTokenData.expiresAt.getTime()) throw new CustomError('expired', 'Verification Token not found!')

    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
    await updateVerificationTokenDb(verificationId, 'email-verification', { expiresAt: newExpiresAt })
    return { message: 'Email verification sent!' }
  })
