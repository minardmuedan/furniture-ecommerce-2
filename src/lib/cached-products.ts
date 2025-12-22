'use cache'

import { getProductDb, getProductsDb, getSubcategoryProductDb } from '@/db/utils/products'
import { cacheLife, cacheTag } from 'next/cache'

export const getCachedProducts = async (params: Parameters<typeof getProductsDb>[0]) => {
  cacheTag('products')
  cacheLife('products')
  return await getProductsDb(params)
}

export const getCacheSubcategoryProduct = async (subcategory: Parameters<typeof getSubcategoryProductDb>[0]) => {
  return await getSubcategoryProductDb(subcategory)
}

export const getCachedProduct = async (productId: string) => {
  cacheTag(`product-${productId}`)
  cacheLife('products')
  return await getProductDb(productId)
}
