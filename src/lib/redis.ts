import type { RedisPubSubSchema, RedisSchema } from '@/types/redis'
import { createClient, type SetOptions } from 'redis'

const redisInstance = createClient({ url: process.env.REDIS_URL })

async function ensureConnected() {
  if (!redisInstance.isOpen) await redisInstance.connect()
  return redisInstance
}

export const redis = {
  set: async <K extends keyof RedisSchema>(key: K, value: RedisSchema[K], options?: SetOptions) =>
    (await ensureConnected()).set(key, JSON.stringify(value), options),
  get: async <K extends keyof RedisSchema>(key: K): Promise<RedisSchema[K] | null> => {
    const raw = await (await ensureConnected()).get(key)
    return raw ? JSON.parse(raw) : null
  },
  del: async (key: keyof RedisSchema) => (await ensureConnected()).del(key),
  publish: async <K extends keyof RedisPubSubSchema>(channel: K, message: RedisPubSubSchema[K]) =>
    (await ensureConnected()).publish(channel, JSON.stringify(message)),
}

const subscriber = redisInstance.duplicate()

export async function redisSubscriberConnect() {
  if (!subscriber.isOpen) await subscriber.connect()

  return {
    subscribe: async (channels: { [K in keyof RedisPubSubSchema]: (onMessage: RedisPubSubSchema[K]) => void }) => {
      await subscriber.subscribe(Object.keys(channels), (message, activeChannel) => {
        const dataMessage = JSON.parse(message)
        channels[activeChannel as keyof typeof channels](dataMessage)
      })
    },
  }
}
