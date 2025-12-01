'use server'

import { createUserDb, getUserByEmailDb, updateUserDb } from '@/db/utils/users'
import { createVerificationTokenDb, deleteUserVerificationTokensDb } from '@/db/utils/verifications'
import { setCookie } from '@/lib/headers'
import { signJWTToken } from '@/lib/jwt-token'
import { mailerSendEmailVerificationToken } from '@/lib/mailer'
import { createServerAction } from '@/lib/server-action'
import { createSession } from '@/lib/session'
import { generateSecureRandomString } from '@/lib/utils'
import bcrypt from 'bcryptjs'
import { signupSchema } from './schema'

export const signupAction = createServerAction(signupSchema)
  .ratelimit({ key: '1', maxAttempt: 8, refill: { attempt: 3, perSeconds: 30 } })
  .handle(async ({ username, email, password }, throwFieldError) => {
    let userId = generateSecureRandomString()
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingUser = await getUserByEmailDb(email)
    if (!existingUser) throwFieldError({ email: 'No user with that email' })
    existingUser?.email

    if (existingUser) {
      if (existingUser.emailVerified) throwFieldError({ email: 'Email already in use!' })
      userId = existingUser.id
      await deleteUserVerificationTokensDb(userId)
      await updateUserDb(userId, { username, password: hashedPassword })
    } else await createUserDb({ id: userId, username, email, password: hashedPassword })

    const tokenId = generateSecureRandomString()
    const token = generateSecureRandomString()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
    await createVerificationTokenDb({ id: tokenId, userId, expiresAt, token, purpose: 'email-verification' })

    const jwtToken = await signJWTToken({ token }, 30)
    await mailerSendEmailVerificationToken(email, jwtToken)

    await createSession(userId, true)
    await setCookie('signup', tokenId, { maxAge: 60 * 15 })
  })
