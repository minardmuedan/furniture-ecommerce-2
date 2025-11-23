import 'server-only'

import z, { type ZodObject } from 'zod'
import { createMemoryRateLimiter } from './rate-limiter'

const handleAction = async <TFnReturn>(fn: () => Promise<TFnReturn>) =>
  await fn()
    .then((data) => ({ success: true, data }) as const)
    .catch(() => ({ success: false, type: 'server_error', message: 'Something went wrong' }) as const)

export const createServerAction = <TFnReturn>(fn: () => Promise<TFnReturn>) => {
  return async () => await handleAction(fn)
}

export const createServerActionWithInputs =
  <TInputs extends ZodObject, TFnReturn>(schema: TInputs, fn: (fields: z.infer<TInputs>) => Promise<TFnReturn>) =>
  async (inputs: z.infer<TInputs>) => {
    const validateInputs = schema.safeParse(inputs)
    if (validateInputs.success) return await handleAction(() => fn(validateInputs.data))
    return { success: false, type: 'invalid_inputs', fieldErrors: z.flattenError(validateInputs.error).fieldErrors } as const
  }

export const createRateLimitedServerAction = <TFnReturn>() => {
  return {
    init: (rateLimit: { id: string; maxAttempt: number; refill: { attempt: number; perSeconds: number } }) => {
      const rateLimiter = createMemoryRateLimiter(rateLimit.maxAttempt, { refill: rateLimit.refill })

      return {
        handle: (fn: () => Promise<TFnReturn>) => {
          return async () => {
            const records = rateLimiter(rateLimit.id)
            if (records.exceed) return { success: false, type: 'rate_limit', retryAt: records.retryAt } as const

            const action = await handleAction(fn)
            if (action.success && records.attempt < 1) return { ...action, lastSubmit: true, retryAt: records.retryAt }
            return action as typeof action & { lastSubmit?: false }
          }
        },
      }
    },
  }
}

const ewan = createRateLimitedServerAction().init({ id: '1', maxAttempt: 2, refill: { attempt: 2, perSeconds: 2 } })

export const createRateLimitedServerActionWithInputs = <TInputs extends ZodObject, TFnReturn>(schema: TInputs) => {
  return {
    init: (rateLimit: { id: string; maxAttempt: number; refill: { attempt: number; perSeconds: number } }) => {
      const rateLimiter = createMemoryRateLimiter(rateLimit.maxAttempt, { refill: rateLimit.refill })

      return {
        handle: (fn: (fields: z.infer<TInputs>) => Promise<TFnReturn>) => {
          return async (inputs: z.infer<TInputs>) => {
            const records = rateLimiter(rateLimit.id)
            if (records.exceed) return { success: false, type: 'rate_limit', retryAt: records.retryAt } as const

            const validateInputs = schema.safeParse(inputs)
            if (!validateInputs.success)
              return { success: false, type: 'invalid_inputs', ...z.flattenError(validateInputs.error) } as const

            const action = await handleAction(() => fn(validateInputs.data))
            if (action.success && records.attempt < 1) return { ...action, lastSubmit: true, retryAt: records.retryAt }
            return action as typeof action & { lastSubmit?: false }
          }
        },
      }
    },
  }
}
