import type { ActionHandler, ActionHandlerWithNoInputs, CustomErrorTypes, FieldErrors } from '@/lib/server-action'
import { useEffect, useState } from 'react'
import { useCountDown } from './countdown'

type InitNoInputs<R> = {
  rateLimitKey: string
  onError?: (error: { type: CustomErrorTypes | 'server_error'; message: string }) => void
  onSuccess?: (data: R) => void
  onSettled?: (actionData: ActionHandlerWithNoInputs<R>) => void
}

type Init<R, T> = Omit<InitNoInputs<R>, 'onSettled'> & {
  onFieldError?: (errorFields: FieldErrors<T>) => void
  onSettled?: (actionData: ActionHandler<R, T>) => void
}

type RateLimiter = { rateLimiter: { isLimit: boolean; remainingSeconds: number } }
type UseServerActionReturnType = RateLimiter & { isPending: boolean }

export function useServerAction<R>(
  serverAction: () => Promise<ActionHandlerWithNoInputs<R>>,
  init: InitNoInputs<R>,
): UseServerActionReturnType & { execute: () => Promise<R> }

export function useServerAction<R, T>(
  serverAction: (fields: T) => Promise<ActionHandler<R, T>>,
  init: Init<R, T>,
): UseServerActionReturnType & { execute: (inputs: T) => Promise<R> }

export function useServerAction<R, T>(
  serverAction: (fields?: T) => Promise<ActionHandlerWithNoInputs<R> | ActionHandler<R, T>>,
  init: InitNoInputs<R> | Init<R, T>,
): UseServerActionReturnType & { execute: (inputs?: T) => Promise<R | undefined> } {
  const [isPending, setIsPending] = useState(false)
  const { timeLeft, setTimeLeft } = useCountDown()

  useEffect(() => {
    const storedRateLimitSecondsLeft = getSecondsLeft(Number(localStorage.getItem(init.rateLimitKey)))
    if (storedRateLimitSecondsLeft > 0) setTimeLeft(storedRateLimitSecondsLeft)
    else localStorage.removeItem(init.rateLimitKey)
  }, [])

  return {
    isPending,
    rateLimiter: { isLimit: timeLeft > 0, remainingSeconds: timeLeft },
    execute: async (inputs?: T) => {
      setIsPending(true)
      const actionData = inputs ? await serverAction(inputs) : await serverAction()

      setIsPending(false)
      ;(init.onSettled as (actionData: any) => void)?.(actionData)

      if (actionData.ratelimit) {
        localStorage.setItem(init.rateLimitKey, actionData.ratelimit.retryAt.toString())
        setTimeLeft(getSecondsLeft(actionData.ratelimit.retryAt))
      }

      if (actionData.isError) {
        const messageError = actionData.type !== 'invalid_inputs' && actionData.type !== 'rate_limit'
        if (messageError) init.onError?.(actionData)

        if (actionData.type === 'invalid_inputs' && 'onFieldError' in init) init.onFieldError?.(actionData.fieldErrors)
      } else {
        const successData = actionData.data
        init.onSuccess?.(successData)
        return successData
      }
    },
  }
}

const getSecondsLeft = (retryAt: number) => Math.ceil((retryAt - Date.now()) / 1000)
