import type { ClientSessionUser, Session } from './session'

export type RedisSchema = {
  [key: `ratelimiter:${string}`]: { tokens: number; lastUsed: number }
  [key: `verification:${'email' | 'password'}:${string}`]: {
    sessionId: string
    token: string
    user: { id: string } & NonNullable<ClientSessionUser>
  }
  [key: `session:${string}`]: { session: Session | null }
}

export type RedisPubSubSchema = {
  EMAIL_VERIFICATION_CHANNEL: { sessionId: string; user: NonNullable<ClientSessionUser>; message: string }
  INVOKE_SESSION_CHANNEL: { sessionId: string; message: string }
}
