import type { ClientSession } from './session'

export type RedisSchema = {
  [key: `ratelimiter:${string}`]: { tokens: number; lastUsed: number }
  [key: `verification:${'email' | 'password'}:${string}`]: {
    sessionId: string
    token: string
    expiresAt: number
    user: { id: string } & NonNullable<ClientSession>['user']
  }
  [key: `session:${string}`]: NonNullable<ClientSession>
}

export type RedisPubSubSchema = {
  EMAIL_VERIFICATION_CHANNEL: { sessionId: string; message: string }
  INVALIDATE_SESSION_CHANNEL: { sessionId: string; message: string }
}
