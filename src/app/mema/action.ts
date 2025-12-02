'use server'

import connectRedis from '@/lib/redis'

export const memaAction = async () => {
  const start = Date.now()
  const redis = await connectRedis()
  await redis.set(`${Date.now()}`, 'minard2123frommema action', { condition: 'NX' })
  console.log('redis duration: ', Date.now() - start, ' ms')
}
