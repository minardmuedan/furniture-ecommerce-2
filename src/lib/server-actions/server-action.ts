import { isRedirectError } from 'next/dist/client/components/redirect-error'
import 'server-only'
import { z } from 'zod'
import { getIpAddress } from '../headers'
import { createRateLimiter, type RateLimiterParams } from '../rate-limiter'

export type RateLimiterInit = { key: string } & RateLimiterParams
type RateLimit = { ratelimit: { refillAt: number } }

type RateLimitError = { isError: true; type: 'rate_limit' } & RateLimit
type ServerError = { isError: true; type: 'server_error'; message: string }
type InputError<TFields> = TFields extends never ? never : { isError: true; type: 'input_error' } & z.core.$ZodFlattenedError<TFields>
type Errors<TFields> = InputError<TFields> | CustomError | ServerError

type Success<R> = { data: R; isError?: undefined }

type ServerActionErrors<TFields> = Errors<TFields> | RateLimitError
export type ServerAction<R, TFields> = (Success<R> | ServerActionErrors<TFields>) & Partial<RateLimit>

export function createServerAction(): {
  ratelimit: (init: RateLimiterInit) => {
    handle: <R>(serverActionFn: () => Promise<R>) => () => Promise<ServerAction<R, never>>
  }
}

export function createServerAction<TSchema extends z.ZodObject | z.ZodIntersection<any>>(
  schema: TSchema,
): {
  ratelimit: (init: RateLimiterInit) => {
    handle: <R>(
      serverActionFn: (fields: z.core.output<TSchema>, throwFieldError: ThrowFieldErrorFn<z.infer<TSchema>>) => Promise<R>,
    ) => (inputs: z.infer<TSchema>) => Promise<ServerAction<R, z.core.output<TSchema>>>
  }
}

export function createServerAction<TSchema extends z.ZodObject | z.ZodIntersection<any>>(schema?: TSchema) {
  type Fields = z.infer<TSchema>
  return {
    ratelimit: (init: RateLimiterInit) => {
      const rateLimiter = createRateLimiter(init)

      return {
        handle: <R>(serverActionFn: (fields?: Fields, throwFieldError?: ThrowFieldErrorFn<Fields>) => Promise<R>) => {
          return async (inputs?: unknown): Promise<ServerAction<R, Fields>> => {
            const limiter = await rateLimiter({ key: init.key, ip: await getIpAddress({ throwWhenNull: true }) })
            if (limiter.isExceed) return { isError: true, type: 'rate_limit', ratelimit: { refillAt: limiter.refillAt } }

            const actionData = await _action()
            const ratelimit = limiter.shouldWarn ? { refillAt: limiter.refillAt } : undefined
            return { ...actionData, ratelimit }

            async function _action(): Promise<Success<R> | Errors<Fields>> {
              try {
                const parsedInputs = schema?.parse(inputs)
                const actionData = schema ? await serverActionFn(parsedInputs, throwFieldZodError) : await serverActionFn()
                return { data: actionData }
              } catch (err) {
                if (isRedirectError(err)) throw err
                if (err instanceof z.ZodError && schema) return { isError: true, type: 'input_error', ...z.flattenError(err) } as InputError<Fields>
                if (err instanceof CustomError) return { ...err }
                return { isError: true, type: 'server_error', message: 'Something went wrong!' }
              }
              //
            }
          }
        },
      }
    },
  }
}

export type ThrowFieldErrorFn<TFields> = typeof throwFieldZodError<TFields>

function throwFieldZodError<TFields>(fields: Partial<Record<keyof TFields, string>>): never {
  throw new z.ZodError(Object.entries(fields).map(([key, value]) => ({ code: 'custom' as const, path: [key], message: value as string })))
}

export type CustomErrorTypes = 'not_found' | 'not_matched' | 'expired' | 'unauthorized' | 'forbidden'
export class CustomError {
  isError = true as const
  type: CustomErrorTypes
  message: string

  constructor(type: CustomErrorTypes, message: string) {
    this.type = type
    this.message = message
  }
}
