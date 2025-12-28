import { getProductStocksDb } from '@/db/utils/product-stocks'
import { getProductDb, getProductsDb, getSubcategoryProductDb } from '@/db/utils/products'
import { cacheLife, cacheTag } from 'next/cache'
import { redis } from './redis'
import { getUserCartProductIdsDb, getUserCartProductsDb } from '@/db/utils/user-carts'
import { accumulateMetadata } from 'next/dist/lib/metadata/resolve-metadata'

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

export const getCachedProductStock = async (productId: string) => {
  const redisData = await redis.get(`product-stocks:${productId}`)
  if (redisData !== null) return redisData

  const dbData = await getProductStocksDb(productId)
  if (!dbData) return null

  await redis.set(`product-stocks:${productId}`, dbData.availableQuantity, { expiration: { type: 'EX', value: 60 } })
  return dbData.availableQuantity
}

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

  const cartData = await Promise.all(
    dbData.cartData.map(async ({ product, ...data }) => ({
      ...data,
      product: { ...product, stocks: (await getCachedProductStock(product.id)) as number },
    })),
  )

  const reducedCartData = cartData.reduce<Map<string, (typeof cartData)[number]>>((acc, item) => {
    const key = item.productId

    if (acc.has(key)) {
      const existing = acc.get(key)!
      existing.quantity += item.quantity
      existing.price = (parseFloat(existing.product.price) * existing.quantity).toFixed(2)
    } else acc.set(key, { ...item })

    return acc
  }, new Map())

  const newDbData = { ...dbData, cartData: Array.from(reducedCartData.values()) }

  await redis.set(`user-cart-products:${userId}:${page}`, newDbData, { expiration: { type: 'EX', value: 60 } })
  return newDbData
}
