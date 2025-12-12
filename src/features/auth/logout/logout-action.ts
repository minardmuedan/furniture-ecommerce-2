'use server'

import { createServerAction } from '@/lib/server-action'
import { invalidateSession } from '@/lib/session'

export const logoutAction = createServerAction()
  .ratelimit({ key: 'logout', capacity: 5, refillRate: 5, refillPerSeconds: 30 })
  .handle(invalidateSession)
