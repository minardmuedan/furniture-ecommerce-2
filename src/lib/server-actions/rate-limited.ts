import type { z, ZodObject } from 'zod'
import { createServerAction, type ActionHandler, type ActionInputError } from '.'

type ActionRateLimitError = { isError: true; type: 'rate_limit'; retryAt: number }
type Init = { key: string; maxAttempt: number; refill: { attempt: number; perSeconds: number } }

export function createRateLimitedServerAction(): {
  init: () => {
    handle: <TFnReturn>(fn: () => Promise<TFnReturn>) => () => Promise<ActionRateLimitError | ActionHandler<TFnReturn>>
  }
}

export function createRateLimitedServerAction<TSchema extends ZodObject>(
  schema: TSchema,
): {
  init: () => {
    handle: <TFnReturn>(
      fn: (fields: z.infer<TSchema>) => Promise<TFnReturn>,
    ) => () => Promise<ActionRateLimitError | ActionInputError<TSchema> | ActionHandler<TFnReturn>>
  }
}

export function createRateLimitedServerAction<TSchema extends ZodObject>(schema?: TSchema) {
  const handler = <TFnReturn>(fn: (fields: z.infer<TSchema>) => Promise<TFnReturn>) =>
    createServerAction(schema).handle(async (fields): Promise<ActionRateLimitError | TFnReturn> => {
      if (!!true) return { isError: true, type: 'rate_limit', retryAt: 23 }
      return await fn(fields)
    })

  return { init: () => ({ handle: handler }) }
}

// const action = createRateLimitedServerAction().init().handle(async()=> ({boba:'asd'}))
// const result = await action()
// if(result.isError && result.type ==='rate_limit') result.
