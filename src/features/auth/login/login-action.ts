'use server'

import { createServerAction, CustomError } from '@/lib/server-action'
import { loginSchema } from '../schema'
import { getUserByEmailDb } from '@/db/utils/users'
import { compare } from 'bcryptjs'
import { createSession } from '@/lib/session'
import { redis } from '@/lib/redis'

export const loginAction = createServerAction(loginSchema)
  .ratelimit({ key: 'login', capacity: 10, refillRate: 5, refillPerSeconds: 30 })
  .handle(async ({ email, password }, throwFieldError) => {
    const user = await getUserByEmailDb(email)
    if (!user) throw throwFieldError({ email: 'User not found!' })
    if (!user.emailVerified) throwFieldError({ email: 'Email is not yet verified! Please signup' })

    const comparePassword = await compare(password, user.password)
    if (!comparePassword) throw new CustomError('not_found', 'Incorrect credentials. Please try again')

    const sessionId = await createSession(user.id)
    await redis.set(`session:${sessionId}`, { sessionId, user: { username: user.username, email } })

    return { message: `Good to see you again, ${user.username}` }
  })
