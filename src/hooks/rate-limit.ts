import type { createRateLimitedServerActionWithInputs } from '@/lib/server-actions'
import { useEffect } from 'react'
import { useCountDown } from './countdown'

export const useRateLimiter = <TFnReturn>(key: string) => {
  const { timeLeft, setTimeLeft } = useCountDown()

  const getSecondsLeft = (retryAt: number) => Math.ceil((retryAt - Date.now()) / 1000)

  useEffect(() => {
    const rateLimit = localStorage.getItem(key)
    if (!rateLimit) return

    const retryAt = Number(rateLimit)
    const secondsLeft = getSecondsLeft(retryAt)

    if (secondsLeft > 0) return setTimeLeft(secondsLeft)
    localStorage.removeItem(key)
  }, [])

  const watchAction = (
    action: Awaited<ReturnType<ReturnType<typeof createRateLimitedServerActionWithInputs<any, TFnReturn>>>>,
  ) => {
    const isRateLimited = !action.success && action.type === 'rate_limit'
    const isLastSubmit = action.success && action.lastSubmit

    if (isLastSubmit || isRateLimited) {
      const secondsLeft = getSecondsLeft(action.retryAt)
      localStorage.setItem(key, action.retryAt.toString())
      setTimeLeft(secondsLeft)
    }
  }

  return { watchAction, disabler: timeLeft > 0, remainingSeconds: timeLeft }
}
