'use server'

import { getUserByEmailDb } from '@/db/utils/users'
import { createServerAction } from '@/lib/server-action'
import { forgotPasswordSchema } from '../schema'
import { createPasswordVerificationToken } from '@/lib/auth-token'
import { mailerSendPasswordVerificationToken } from '@/lib/mailer'
import { setCookie } from '@/lib/headers'
import { FIFTEEN_MINUTES_IN_SECONDS } from '@/lib/data-const'

export const forgotPasswordAction = createServerAction(forgotPasswordSchema)
  .ratelimit({ key: 'forgot-password', capacity: 10, refillRate: 5, refillPerSeconds: 30 })
  .handle(async ({ email }, throwFieldError) => {
    const user = await getUserByEmailDb(email)
    if (!user) throw throwFieldError({ email: 'User not found!' })
    if (!user.emailVerified) throwFieldError({ email: 'Email is not yet verified! Please signup' })

    const { jwtToken } = await createPasswordVerificationToken({ user: { id: user.id, email } })
    await mailerSendPasswordVerificationToken(email, jwtToken)

    await setCookie('forgot-password', email, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })
