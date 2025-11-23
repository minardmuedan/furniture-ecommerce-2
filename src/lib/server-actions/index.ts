import { z, type ZodObject } from 'zod'

type Success<T> = T & { isError?: undefined }
type ActionServerError = { isError: true; type: 'server_error'; message: string }
type ActionInputError<TSchema> = { isError: true; type: 'invalid_input' } & z.core.$ZodFlattenedError<z.core.output<TSchema>>

type ActionHandler<T> = Success<T> | ActionServerError

const handleAction = async <R>(fn: () => Promise<R>): Promise<ActionHandler<R>> => {
  try {
    const data = await fn()
    return { ...data } as Success<R>
  } catch {
    return { isError: true, type: 'server_error', message: 'Something went wrong!' }
  }
}

export function createServerAction(): { handle: <R>(fn: () => Promise<R>) => () => Promise<ActionHandler<R>> }

export function createServerAction<TSchema extends ZodObject>(
  schema: TSchema,
): {
  handle: <R>(
    fn: (fields: z.infer<TSchema>) => Promise<R>,
  ) => (input: z.infer<TSchema>) => Promise<ActionHandler<R> | ActionInputError<TSchema>>
}

export function createServerAction(schema?: ZodObject) {
  return {
    handle: <R>(fn: (fields?: unknown) => Promise<R>) => {
      return async (userInputs: unknown): Promise<ActionHandler<R> | ActionInputError<unknown>> => {
        if (schema) {
          const validatedFields = schema.safeParse(userInputs)
          if (validatedFields.success) return handleAction(() => fn(validatedFields.data))
          return { isError: true, type: 'invalid_input', ...z.flattenError(validatedFields.error) }
        }

        return handleAction(fn)
      }
    },
  }
}
