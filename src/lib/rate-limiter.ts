import 'server-only'
import { redis } from './redis'

export type RateLimiterParams = { capacity: number; refillRate: number; refillPerSeconds: number }

type RateLimitReturnType = ({ isExceed: true } | { isExceed: false; shouldWarn: boolean }) & { refillAt: number }

export const createRateLimiter = ({ capacity, refillRate, refillPerSeconds }: RateLimiterParams) => {
  const refillPerMs = refillPerSeconds * 1000
  return async ({ key, ip }: { key: string; ip: string }): Promise<RateLimitReturnType> => {
    const now = Date.now()
    const identifier = `ratelimiter:${key}:${ip}` as const

    const data = await redis.get(identifier)
    let { tokens, lastUsed } = data ?? { tokens: capacity, lastUsed: now }

    const elapsed = now - lastUsed
    const tokensToAdd = Math.floor(elapsed / refillPerMs) * refillRate
    tokens = Math.min(capacity, tokens + tokensToAdd)

    if (tokens <= 0) return { isExceed: true, refillAt: lastUsed + refillPerMs }

    tokens--
    lastUsed = now
    await redis.set(identifier, { tokens, lastUsed }, { expiration: { type: 'EX', value: capacity * refillPerSeconds } })
    return { isExceed: false, refillAt: lastUsed + refillPerMs, shouldWarn: tokens < 1 }
  }
}
