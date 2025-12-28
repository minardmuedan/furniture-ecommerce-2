import type { Route } from 'next'
import type { ClientSession } from './session'
import type { PaginationProducts, Product } from './products'
import type { Pagination } from './helpers'

type R<T extends string> = T | `${T}?${string}`

export type ApiSchema = {
  '/api/auth': ClientSession
  '/api/user/cart': string[]
  [key: `/api/product-stocks/${string}`]: string
} & {
  [k in R<'/api/products'>]: PaginationProducts
} & {
  [k in R<'/api/user/cart/products'>]: Pagination<{
    id: string
    productId: string
    quantity: number
    price: string
    product: Product & { stocks: number }
  }>
}

export type PaginatedApiRoutes = { [K in keyof ApiSchema]: ApiSchema[K] extends Pagination<any> ? K : never }[keyof ApiSchema]

export type AppRouter = {
  push: (href: Route) => void
  replace: (href: Route) => void
  prefetch: (href: Route) => void
  back: () => void
  refresh: () => void
}
