import { createServerAction, CustomError, type RateLimiterInit, type ServerAction, type ThrowFieldErrorFn } from '@/lib/server-actions/server-action'
import { validateSession } from '@/lib/session'
import type { Session } from '@/types/session'
import type z from 'zod'

export function createAuthedServerAction(): {
  ratelimit: (init: RateLimiterInit) => {
    handle: <R>(serverAction: (session: Session) => Promise<R>) => () => Promise<ServerAction<R, never>>
  }
}

export function createAuthedServerAction<TSchema extends z.ZodObject | z.ZodIntersection<any>>(
  schema: TSchema,
): {
  ratelimit: (init: RateLimiterInit) => {
    handle: <R>(
      serverAction: (session: Session, fields: z.core.output<TSchema>, throwFieldError: ThrowFieldErrorFn<z.infer<TSchema>>) => Promise<R>,
    ) => (inputs: z.infer<TSchema>) => Promise<ServerAction<R, z.core.output<TSchema>>>
  }
}

export function createAuthedServerAction<TSchema extends z.ZodObject | z.ZodIntersection<any>>(schema?: TSchema) {
  return {
    ratelimit: (init: RateLimiterInit) => ({
      handle: <R>(
        serverAction: (session: Session, fields?: z.core.output<TSchema>, throwFieldError?: ThrowFieldErrorFn<z.infer<TSchema>>) => Promise<R>,
      ) => {
        const handler = async (fields?: z.core.output<TSchema>, throwFieldError?: ThrowFieldErrorFn<z.infer<TSchema>>) => {
          const session = await validateSession()
          if (!session) throw new CustomError('unauthorized', 'Please login to continue')
          return await serverAction(session, fields, throwFieldError)
        }

        if (!schema) return createServerAction().ratelimit(init).handle(handler)
        return createServerAction(schema).ratelimit(init).handle(handler)
      },
    }),
  }
}
