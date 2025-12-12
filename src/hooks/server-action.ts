import type { CustomErrorTypes, ServerAction } from '@/lib/server-action'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCountdown } from './countdown'
import type { AppRouter } from '@/types/app-router'

type OnErrorErrors = { type: CustomErrorTypes | 'server_error'; message: string }

type InitNoInputs<R> = {
  rateLimitKey: string
  onSuccess?: (data: R, router: AppRouter) => void
  onError?: (error: OnErrorErrors, router: AppRouter) => void
  onSettled?: (actionData: { success: true; data: R } | { success: false; error: OnErrorErrors }, router: AppRouter) => void
}
type Init<R, TFields> = InitNoInputs<R> & { onFieldError?: (errorFields: { [P in keyof TFields]?: string[] }) => void }

type UseServerActionReturnType = { isPending: boolean; isHydrated: boolean; rateLimiter: { isLimit: boolean; secondsLeft: number } }

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
  const [isHydrated, setIsHydrated] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const { secondsLeft, setTargetDate } = useCountdown()

  useEffect(() => {
    const storageRatelimitDate = Number(localStorage.getItem(init.rateLimitKey))
    if (storageRatelimitDate > 0) setTargetDate(storageRatelimitDate)
    else localStorage.removeItem(init.rateLimitKey)
    setIsHydrated(true)
  }, [])

  return {
    isHydrated,
    isPending,
    rateLimiter: { isLimit: secondsLeft > 0, secondsLeft },
    execute: async (inputs: TFields) => {
      setIsPending(true)
      const actionData = await serverAction(inputs)

      setIsPending(false)

      if (actionData.ratelimit) {
        setTargetDate(actionData.ratelimit.refillAt)
        localStorage.setItem(init.rateLimitKey, actionData.ratelimit.refillAt.toString())
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

export const setRatelimit = (key: string, seconds: number) => {
  localStorage.setItem(key, new Date(Date.now() + 1000 * seconds).getTime().toString())
}
