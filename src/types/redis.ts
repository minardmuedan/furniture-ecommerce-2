import type { ClientSessionUser, Session } from './session'

export type RedisSchema = {
  [key: `ratelimiter:${string}`]: { tokens: number; lastUsed: number }
  [key: `verification:${'email' | 'password'}:${string}`]: {
    sessionId: string
    token: string
    user: { id: string } & NonNullable<ClientSessionUser>
    expiresAt: number
  }
  [key: `session:${string}`]: Session | null
}

export type RedisPubSubSchema = {
  EMAIL_VERIFICATION_CHANNEL: { sessionId: string; message: string }
  INVOKE_SESSION_CHANNEL: { sessionId: string; message: string }
}
