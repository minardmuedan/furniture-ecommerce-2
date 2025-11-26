'use server'

import { createServerAction, throwFieldError } from '@/lib/server-action'
import { signupSchema, type SignupSchema } from './schema'

export const signupAction = createServerAction(signupSchema)
  .ratelimit({ key: '1', maxAttempt: 8, refill: { attempt: 3, perSeconds: 30 } })
  .handle(async () => {
    throwFieldError<SignupSchema>([{ email: 's', confirmPassword: 'pp' }])
  })
