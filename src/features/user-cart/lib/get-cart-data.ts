import { getUserCartProductIdsDb, getUserCartProductsDb } from '@/db/utils/user-carts'
import { redis } from '@/lib/redis'

export const getCachedUserCartProductIds = async (userId: string) => {
  const redisData = await redis.get(`user-cart:${userId}`)
  if (redisData !== null) return redisData

  const dbData = await getUserCartProductIdsDb(userId)
  const productIds = dbData.map((d) => d.productId)

  await redis.set(`user-cart:${userId}`, productIds, { expiration: { type: 'EX', value: 60 } })
  return productIds
}

export const getCachedUserCartProducts = async (userId: string, page: number) => {
  const redisData = await redis.get(`user-cart-products:${userId}:${page}`)
  if (redisData !== null) return redisData

  const dbData = await getUserCartProductsDb({ userId, page })

  await redis.set(`user-cart-products:${userId}:${page}`, dbData, { expiration: { type: 'EX', value: 60 } })
  return dbData
}
