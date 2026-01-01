import { useFetcher } from '@/hooks/fetche'
import { useInfiniteFetcher } from '@/hooks/fetcher'

export const useUserCartProductIds = () => {
  const { data, mutate, revalidate } = useFetcher('/api/user/cart')
  return { cartProductIds: data, mutate, revalidate }
}

export const useUserCartProducts = () => useInfiniteFetcher('/api/user/cart/products')
