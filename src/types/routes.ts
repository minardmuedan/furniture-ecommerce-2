import type { Route } from 'next'
import type { ClientSession } from './session'
import type { CartDataProduct, PaginationProducts } from './products'
import type { Pagination } from './helpers'

export type ApiSchema = {
  '/api/auth': ClientSession
  '/api/user/cart': string[]
  [key: `/api/product-stocks/${string}`]: string

  '/api/user/cart/products': Pagination<CartDataProduct>
  '/api/products': PaginationProducts
}

export type PaginatedApiRoutes = { [K in keyof ApiSchema]: ApiSchema[K] extends Pagination<any> ? K : never }[keyof ApiSchema]

export type AppRouter = {
  push: (href: Route) => void
  replace: (href: Route) => void
  prefetch: (href: Route) => void
  back: () => void
  refresh: () => void
}
