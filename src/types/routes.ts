import type { Route } from 'next'
import type { ClientSession } from './session'
import type { PaginationProducts } from './products'
import type { Pagination } from './helpers'

type R<T extends string> = T | `${T}?${string}`

export type ApiSchema = { '/api/auth': ClientSession } & {
  [k in R<'/api/products'>]: PaginationProducts
}

export type PaginatedApiRoutes = { [K in keyof ApiSchema]: ApiSchema[K] extends Pagination<any> ? K : never }[keyof ApiSchema]

export type AppRouter = {
  push: (href: Route) => void
  replace: (href: Route) => void
  prefetch: (href: Route) => void
  back: () => void
  refresh: () => void
}
