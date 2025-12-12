'use server'

import { createServerAction, CustomError } from '@/lib/server-action'
import { loginSchema } from '../schema'
import { getUserByEmailDb } from '@/db/utils/users'
import { compare } from 'bcryptjs'

export const loginAction = createServerAction(loginSchema)
  .ratelimit({ key: 'login', capacity: 10, refillRate: 5, refillPerSeconds: 30 })
  .handle(async ({ email, password }, throwFieldError) => {
    const user = await getUserByEmailDb(email)
    if (!user) throw throwFieldError({ email: 'User not found!' })

    const comparePassword = await compare(password, user.password)
    if (!comparePassword) throw new CustomError('not_found', 'Incorrect credentials. Please try again')

    if (!user.emailVerified) throwFieldError({ email: 'Email is not yet verified! Please signup' })

    console.log('authenticated')
  })
