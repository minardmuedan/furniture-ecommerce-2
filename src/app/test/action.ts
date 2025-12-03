'use server'

import { createServerAction } from '@/lib/server-action'

export const testAction = createServerAction()
  .ratelimit({ key: '123', capacity: 10, refillRate: 3, refillPerSeconds: 20 })
  .handle(async () => {
    return { datafromaction: 'hello im the data wazzupp' }
  })
