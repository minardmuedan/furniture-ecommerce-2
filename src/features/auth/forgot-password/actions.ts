'use server'

import { getUserSessionsDb, logoutAllUserSessionDb } from '@/db/utils/sessions'
import { getUserByEmailDb, updateUserDb } from '@/db/utils/users'
import { createVerificationToken, deleteVerificationToken, getVerificationToken, getVerificationTokenByJwtToken } from '../lib/auth-token'
import { FIFTEEN_MINUTES_IN_SECONDS } from '@/lib/data-const'
import { deleteCookie, getCookie, setCookie } from '@/lib/headers'
import { mailerSendPasswordVerificationToken } from '@/lib/mailer'
import { redis } from '@/lib/redis'
import { createServerAction, CustomError } from '@/lib/server-actions/server-action'
import { hash } from 'bcryptjs'
import { changePasswordSchema, forgotPasswordSchema, jwtTokenSchema } from '../lib/schema'

export const forgotPasswordAction = createServerAction(forgotPasswordSchema)
  .ratelimit({ key: 'forgot-password', capacity: 10, refillRate: 5, refillPerSeconds: 30 })
  .handle(async ({ email }, throwFieldError) => {
    const user = await getUserByEmailDb(email)
    if (!user) throw throwFieldError({ email: 'User not found!' })
    if (!user.emailVerified) throwFieldError({ email: 'Email is not yet verified! Please signup' })

    const { jwtToken } = await createVerificationToken('password', email, { user: { id: user.id, username: user.username } })
    await mailerSendPasswordVerificationToken(email, jwtToken)

    await setCookie('forgot-password', email, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })

export const resendPasswordVerificationAction = createServerAction()
  .ratelimit({ key: 'resend-password-verification', capacity: 1, refillRate: 1, refillPerSeconds: 30 })
  .handle(async () => {
    const email = await getCookie('forgot-password')
    if (!email) throw new CustomError('not_found', 'Verification Token not found!')

    const { user } = await getVerificationToken('password', email)
    const { jwtToken } = await createVerificationToken('password', email, { user })

    await mailerSendPasswordVerificationToken(email, jwtToken)
    await setCookie('forgot-password', email, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })

export const cancelPasswordVerificationAction = async () => await deleteCookie('forgot-password')

export const changeUserPasswordAction = createServerAction(jwtTokenSchema.and(changePasswordSchema))
  .ratelimit({ key: 'change-password', capacity: 1, refillRate: 1, refillPerSeconds: 30 })
  .handle(async ({ jwtToken, password }) => {
    const { email, user } = await getVerificationTokenByJwtToken('password', jwtToken)
    const hashedPassword = await hash(password, 10)

    await updateUserDb(user.id, { password: hashedPassword })
    await logoutAllUserSessionDb(user.id)

    const userSessions = await getUserSessionsDb(user.id)

    await Promise.all(
      userSessions.map(async ({ id }) => {
        await redis.del(`session:${id}`)
        await redis.publish('INVALIDATE_SESSION_CHANNEL', { sessionId: id, message: 'Session invalidated, Please login again!' })
      }),
    )

    await deleteVerificationToken('password', email)
    await deleteCookie('forgot-password')

    return { message: `Success! Password updated for ${user.username}. Try to log it in` }
  })
