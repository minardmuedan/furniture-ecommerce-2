import { getProductStocksDb } from '@/db/utils/product-stocks'
import { getProductDb, getProductsDb, getSubcategoryProductDb } from '@/db/utils/products'
import { cacheLife, cacheTag } from 'next/cache'
import { redis } from './redis'

export const getCachedProducts = async (params: Parameters<typeof getProductsDb>[0]) => {
  'use cache'
  cacheTag('products')
  cacheLife('products')
  return await getProductsDb(params)
}

export const getCachedSubcategoryProduct = async (subcategory: Parameters<typeof getSubcategoryProductDb>[0]) => {
  'use cache'
  cacheTag('products')
  cacheLife('products')
  return await getSubcategoryProductDb(subcategory)
}

export const getCachedProduct = async (productId: string) => {
  'use cache'
  cacheTag(`product-${productId}`)
  cacheLife('products')
  return await getProductDb(productId)
}

export const getCachedProductStock = async (productId: string): Promise<number> => {
  const redisData = await redis.get(`product-stocks:${productId}`)
  if (redisData !== null) return redisData

  const dbData = (await getProductStocksDb(productId)) as { availableQuantity: number }

  await redis.set(`product-stocks:${productId}`, dbData.availableQuantity, { expiration: { type: 'EX', value: 60 } })
  return dbData.availableQuantity
}
