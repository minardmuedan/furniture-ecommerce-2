import 'server-only'
import { redisPublisherConnect } from './redis'

export type RateLimiterParams = { capacity: number; refillRate: number; refillPerSeconds: number }

type RateLimitReturnType = ({ isExceed: true } | { isExceed: false; shouldWarn: boolean }) & { refillAt: number }

export const createRateLimiter = ({ capacity, refillRate, refillPerSeconds }: RateLimiterParams) => {
  const refillPerMs = refillPerSeconds * 1000
  return async ({ key, ip }: { key: string; ip: string }): Promise<RateLimitReturnType> => {
    const now = Date.now()
    const identifier = `ratelimit:${key}:${ip}`
    const redis = await redisPublisherConnect()

    const data = await redis.hGetAll(identifier)
    let tokens = data.tokens ? parseInt(data.tokens) : capacity
    let lastUsed = data.lastUsed ? parseInt(data.lastUsed) : now

    const elapsed = now - lastUsed
    const tokensToAdd = Math.floor(elapsed / refillPerMs) * refillRate
    tokens = Math.min(capacity, tokens + tokensToAdd)

    if (tokens <= 0) return { isExceed: true, refillAt: lastUsed + refillPerMs }

    lastUsed = now
    tokens--
    await redis
      .multi()
      .hSet(identifier, { tokens, lastUsed })
      .expire(identifier, capacity * refillPerSeconds)
      .exec()
    return { isExceed: false, refillAt: lastUsed + refillPerMs, shouldWarn: tokens < 1 }
  }
}
