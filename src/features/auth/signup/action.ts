'use server'

import bcrypt from 'bcryptjs'
import { createServerAction, throwFieldError } from '@/lib/server-action'
import { signupSchema, type SignupSchema } from './schema'
import { createUserDb, getUserByEmailDb, updateUserDb } from '@/db/utils/users'
import { generate6DigitsCode, generateSecureRandomString } from '@/lib/utils'
import { createVerificationTokenDb, deleteUserVerificationTokensDb, deleteVerificationTokenDb } from '@/db/utils/verifications'
import { setCookie } from '@/lib/headers'

export const signupAction = createServerAction(signupSchema)
  .ratelimit({ key: '1', maxAttempt: 8, refill: { attempt: 3, perSeconds: 30 } })
  .handle(async ({ username, email, password }) => {
    let userId = generateSecureRandomString()
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmailDb(email)
    if (existingUser) {
      if (existingUser.emailVerified) throwFieldError<SignupSchema>([{ email: 'Email already in use!' }])
      userId = existingUser.id
      await deleteUserVerificationTokensDb(userId)
      await updateUserDb(userId, { username, password: hashedPassword })
    } else await createUserDb({ id: userId, username, email, password: hashedPassword })

    const tokenId = generateSecureRandomString()
    const code = generate6DigitsCode()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
    await createVerificationTokenDb({ id: tokenId, userId, expiresAt, code, purpose: 'email-verification' })

    await setCookie('signup', tokenId, { maxAge: 60 * 15 })
  })
