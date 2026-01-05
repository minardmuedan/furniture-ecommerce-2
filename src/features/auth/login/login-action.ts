'use server'

import { getUserByEmailDb } from '@/db/utils/users'
import { DAY_IN_MS } from '@/lib/data-const'
import { redis } from '@/lib/redis'
import { createServerAction, CustomError } from '@/lib/server-actions/server-action'
import { createSession } from '@/lib/session'
import { compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { loginSchema } from '../lib/schema'

export const loginAction = createServerAction(loginSchema)
  .ratelimit({ key: 'login', capacity: 10, refillRate: 5, refillPerSeconds: 30 })
  .handle(async ({ email, password }, throwFieldError) => {
    const user = await getUserByEmailDb(email)
    if (!user) throw throwFieldError({ email: 'User not found!' })
    if (!user.emailVerified) throwFieldError({ email: 'Email is not yet verified! Please signup' })

    const comparePassword = await compare(password, user.password)
    if (!comparePassword) throw new CustomError('not_found', 'Incorrect credentials. Please try again')

    const { id: userId, username, isAdmin } = user
    const sessionId = await createSession(userId)

    await redis.set(
      `session:${sessionId}`,
      { session: { sessionId, user: { id: userId, username, email, isAdmin } } },
      { expiration: { type: 'PX', value: DAY_IN_MS } },
    )

    if (user.isAdmin) redirect('/admin/dashboard')

    return { message: `Good to see you again, ${user.username}` }
  })
