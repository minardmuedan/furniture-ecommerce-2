import type { CustomErrorTypes, ServerAction } from '@/lib/server-action'
import { useEffect, useState } from 'react'
import { useCountDown } from './countdown'
import { useRouter } from 'next/navigation'
import type { Route } from 'next'
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type AppRouterType = {
  push(href: Route): void
  replace(href: Route): void
  prefetch(href: Route): void
  back(): void
  refresh(): void
}

type OnErrorErrors = { type: CustomErrorTypes | 'server_error'; message: string }
type InitNoInputs<R> = {
  rateLimitKey: string
  onSuccess?: (data: R, router: AppRouterType) => void
  onError?: (error: OnErrorErrors, router: AppRouterType) => void
  onSettled?: (actionData: { success: true; data: R } | { success: false; error: OnErrorErrors }, router: AppRouterType) => void
}
type Init<R, TFields> = InitNoInputs<R> & { onFieldError?: (errorFields: { [P in keyof TFields]?: string[] }) => void }

type UseServerActionReturnType = { isPending: boolean; rateLimiter: { isLimit: boolean; remainingSeconds: number } }

export function useServerAction<R>(
  serverAction: () => Promise<ServerAction<R, never>>,
  init: InitNoInputs<R>,
): UseServerActionReturnType & { execute: () => Promise<R> }

export function useServerAction<R, TFields>(
  serverAction: (fields: TFields) => Promise<ServerAction<R, TFields>>,
  init: Init<R, TFields>,
): UseServerActionReturnType & { execute: (inputs: TFields) => Promise<R> }

export function useServerAction<R, TFields>(
  serverAction: (() => Promise<ServerAction<R, never>>) | ((fields: TFields) => Promise<ServerAction<R, TFields>>),
  init: Init<R, TFields>,
) {
  const router = useRouter()
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
    execute: async (inputs: TFields) => {
      setIsPending(true)
      const actionData = await serverAction(inputs)

      setIsPending(false)

      if (actionData.ratelimit) {
        localStorage.setItem(init.rateLimitKey, actionData.ratelimit.refillAt.toString())
        setTimeLeft(getSecondsLeft(actionData.ratelimit.refillAt))
      }

      if (actionData.isError) {
        if (actionData.type === 'input_error') init.onFieldError?.(actionData.fieldErrors)

        if (actionData.type !== 'rate_limit' && actionData.type !== 'input_error') {
          init.onError?.(actionData, router)
          init.onSettled?.({ success: false, error: actionData }, router)
        }
        return undefined
      }

      const data = actionData.data
      init.onSuccess?.(data, router)
      init.onSettled?.({ success: true, data }, router)
      return data
    },
  }
}

const getSecondsLeft = (retryAt: number) => Math.ceil((retryAt - Date.now()) / 1000)
