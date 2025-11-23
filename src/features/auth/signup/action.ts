'use server'

import { createRateLimitedServerActionWithInputs } from '@/lib/server-actions'
import { signupSchema } from './schema'

export const signupAction = createRateLimitedServerActionWithInputs(signupSchema)
  .init({ id: '1', maxAttempt: 8, refill: { attempt: 3, perSeconds: 20 } })
  .handle(async () => {})
