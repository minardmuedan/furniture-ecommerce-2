import { useInfiniteFetcher } from '@/hooks/fetcher'

export const useUserCartProducts = () => useInfiniteFetcher('/api/user/cart/products')
