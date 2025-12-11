'use server'

import { deleteUserSessionsDb } from '@/db/utils/sessions'
import { createUserDb, getUserByEmailDb, updateUserDb } from '@/db/utils/users'
import { setCookie } from '@/lib/headers'
import { mailerSendEmailVerificationToken } from '@/lib/mailer'
import { createServerAction } from '@/lib/server-action'
import { createSession } from '@/lib/session'
import { generateSecureRandomString } from '@/lib/utils'
import { hash } from 'bcryptjs'
import { createVerificationToken } from '../helpers/token'
import { signupSchema } from '../schema'
import { FIFTEEN_MINUTES_IN_SECONDS } from '@/lib/data-const'

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
    const { jwtToken } = await createVerificationToken('email', { sessionId, user: { id: userId, username, email } })

    await mailerSendEmailVerificationToken(email, jwtToken)
    await setCookie('signup', email, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })
