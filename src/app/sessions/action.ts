import { redis } from '@/lib/redis'

export const invokeSessionAction = async (sessionId: string) => {
  await redis.publish('INVOKE_SESSION_CHANNEL', { sessionId, message: 'Someone invoke your session, IDK dont ask me!' })
}
