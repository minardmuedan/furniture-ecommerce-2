import type { ClientSession, Session } from './session'

export type RedisSchema = {
  [key: `ratelimiter:${string}`]: { tokens: number; lastUsed: number }
  [key: `verification:${'email' | 'password'}:${string}`]: NonNullable<ClientSession> & {
    token: string
    expiresAt: number
  }
  [key: `session:${string}`]: Session | null
}

export type RedisPubSubSchema = {
  EMAIL_VERIFICATION_CHANNEL: { sessionId: string; message: string }
  INVOKE_SESSION_CHANNEL: { sessionId: string; message: string }
}
