import type { Route } from 'next'

export type AppRouter = {
  push: (href: Route) => void
  replace: (href: Route) => void
  prefetch: (href: Route) => void
  back: () => void
  refresh: () => void
}
