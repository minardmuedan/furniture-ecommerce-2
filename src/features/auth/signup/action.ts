'use server'

import { createUserDb, getUserByEmailDb, updateUserDb } from '@/db/utils/users'
import { FIFTEEN_MINUTES_IN_SECONDS, SESSION_COOKIE_KEY } from '@/lib/data-const'
import { getCookie, setCookie } from '@/lib/headers'
import { signJWTToken } from '@/lib/jwt-token'
import { mailerSendEmailVerificationToken } from '@/lib/mailer'
import { createServerAction } from '@/lib/server-action'
import { setSession } from '@/lib/session/set-session'
import { generateSecureRandomString } from '@/lib/utils'
import bcrypt from 'bcryptjs'
import { signupSchema } from './schema'
import { redis } from '@/lib/redis'

export const signupAction = createServerAction(signupSchema)
  .ratelimit({ key: 'signup', capacity: 8, refillRate: 3, refillPerSeconds: 30 })
  .handle(async ({ username, email, password }, throwFieldError) => {
    const sessionId = await getCookie(SESSION_COOKIE_KEY)
    let userId = generateSecureRandomString()
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingUser = await getUserByEmailDb(email)

    if (existingUser) {
      if (existingUser.emailVerified) throwFieldError({ email: 'Email already in use!' })
      userId = existingUser.id
      await updateUserDb(userId, { username, password: hashedPassword })
    } else await createUserDb({ id: userId, username, email, password: hashedPassword })

    const verificationId = generateSecureRandomString()
    const token = generateSecureRandomString()

    await redis.set(
      `verification:email:${verificationId}`,
      { sessionId, user: { id: userId, email, username }, token },
      { expiration: { type: 'EX', value: FIFTEEN_MINUTES_IN_SECONDS } },
    )

    const jwtToken = await signJWTToken({ verificationId, token })
    await mailerSendEmailVerificationToken(email, jwtToken)

    await setSession(sessionId, userId, true)
    await setCookie('signup', verificationId, { maxAge: FIFTEEN_MINUTES_IN_SECONDS })
  })
