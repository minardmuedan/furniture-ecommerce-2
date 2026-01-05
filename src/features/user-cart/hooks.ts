import { useFetcher, useInfiniteFetcher } from '@/hooks/fetcher'
import { useSWRConfig } from 'swr'

export const useUserCartProductIds = () => {
  const { data, mutate } = useFetcher('/api/user/cart')
  return { cartProductIds: data, mutate }
}

export const useUserCartProducts = () => useInfiniteFetcher('/api/user/cart/products')

export const useDeleteUserCartProductsCache = () => {
  const { cache } = useSWRConfig()

  const handleDelete = () => {
    const keys = Array.from(cache.keys()).filter((key) => key.includes('/api/user/cart/products'))
    keys.map((key) => cache.delete(key))
  }

  return handleDelete
}
