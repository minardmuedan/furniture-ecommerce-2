import { z, ZodError, type ZodObject } from 'zod'
import { createMemoryRateLimiter, type RateLimiterParams } from './rate-limiter'
import { typedObjectEntries } from './utils'

type RateLimit = { ratelimit: { retryAt: number } }
type RateLimiterInit = { key: string } & RateLimiterParams

export type FieldErrors<T> = { [P in keyof T]?: string[] }
type InputError<T> = { type: 'invalid_inputs'; formErrors: string[]; fieldErrors: FieldErrors<T> }
type ServerError = { type: 'server_error'; message: string }
type RateLimitError = { type: 'rate_limit' } & RateLimit

type Errors<T> = { isError: true } & (RateLimitError | InputError<T> | CustomError | ServerError)

type Success = { isError?: undefined }
type HandlerSuccess<R> = Success & { data: R }

export type ActionHandler<R, T = undefined> = Partial<RateLimit> & (HandlerSuccess<R> | Errors<T>)
export type ActionHandlerWithNoInputs<R> = Exclude<ActionHandler<R>, InputError<undefined>>

function handler<TSchema extends ZodObject>(schema?: TSchema) {
  type InferredSchema = z.infer<TSchema>
  return {
    ratelimit: (init: RateLimiterInit) => {
      const rateLimiter = createMemoryRateLimiter(init)

      return {
        handle: <R>(action: (fields?: InferredSchema) => Promise<R>) => {
          return async (userInputs?: InferredSchema): Promise<ActionHandler<R, InferredSchema>> => {
            const limiter = rateLimiter(init.key)
            if (limiter.isExceed) return { isError: true, type: 'rate_limit', ratelimit: { retryAt: limiter.refillAt } }

            const newLimiter = limiter.decrement()
            const data = await actionFn()
            return { ...data, ratelimit: newLimiter.shouldWarn ? { retryAt: newLimiter.refillAt } : undefined }

            async function actionFn(): Promise<HandlerSuccess<R> | Exclude<Errors<InferredSchema>, RateLimitError>> {
              try {
                const fields = schema ? schema.parse(userInputs) : undefined
                const data = await action(fields)
                return { data }
              } catch (err) {
                if (err instanceof CustomError) return { isError: true, ...err }
                if (err instanceof ZodError) return { isError: true, type: 'invalid_inputs', ...z.flattenError(err) }
                return { isError: true, type: 'server_error', message: 'Something went wrong' }
              }
            }
          }
        },
      }
    },
  }
}

export function createServerAction(): {
  ratelimit: (init: RateLimiterInit) => {
    handle: <R>(action: () => Promise<R>) => () => Promise<ActionHandlerWithNoInputs<R>>
  }
}

// prettier-ignore
export function createServerAction<TSchema extends ZodObject>(schema: TSchema): {
  ratelimit: (init: RateLimiterInit) => {
    handle: <R>(action: (fields: z.infer<TSchema>) => Promise<R>) => (userInputs: z.infer<TSchema>) => Promise<ActionHandler<R, z.infer<TSchema>>>
  }
}

export function createServerAction(schema?: ZodObject) {
  return handler(schema)
}

export function throwFieldError<T>(fields: Partial<Record<keyof T, string>>): never {
  const errors = typedObjectEntries(fields).map(([key, value]) => ({ code: 'custom' as const, path: [key], message: value }))
  throw new ZodError(errors)
}

export type CustomErrorTypes = 'not_found' | 'expired' | 'unauthorized' | 'forbidden'

export class CustomError {
  type: CustomErrorTypes
  message: string

  constructor(type: CustomErrorTypes, message: string) {
    this.type = type
    this.message = message
  }
}
