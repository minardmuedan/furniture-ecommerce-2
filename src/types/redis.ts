import type { Session } from './session'

export type RedisSchema = {
  [key: `ratelimiter:${string}`]: { tokens: number; lastUsed: number }
  [key: `verification:email:${string}`]: { sessionId: string; token: string; expiresAt: number; user: { id: string; username: string } }
  [key: `verification:password:${string}`]: { token: string; expiresAt: number; user: { id: string; username: string } }
  [key: `session:${string}`]: { session: Session | null }
}

export type RedisPubSubSchema = {
  EMAIL_VERIFICATION_CHANNEL: { sessionId: string; message: string }
  INVALIDATE_SESSION_CHANNEL: { sessionId: string; message: string }
}
