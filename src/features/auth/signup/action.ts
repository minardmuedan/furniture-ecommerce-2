import { createServerAction } from '@/lib/server-action'
import { signupSchema } from '../schema'

export const signupAction = createServerAction(signupSchema)
  .ratelimit({ key: 'signup', capacity: 5, refillRate: 5, refillPerSeconds: 30 })
  .handle(async ({ username, email, password }, throwFieldError) => {})
