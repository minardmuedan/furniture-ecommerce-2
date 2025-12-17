import type { ApiSchema, PaginatedApiRoutes } from '@/types/routes'
import useSWRInfinite, { type SWRInfiniteConfiguration } from 'swr/infinite'

export function useInfiniteFetcher<T extends PaginatedApiRoutes>(
  url: T | { path: T; searchParams?: Partial<Record<string, string>> },
  config?: Omit<SWRInfiniteConfiguration<ApiSchema[T]>, 'revalidateFirstPage'>,
) {
  const { data, size, setSize, error, isLoading, isValidating } = useSWRInfinite<ApiSchema[T], { message: string }>(
    (pageIndex) => {
      const page = `${pageIndex + 1}`
      if (typeof url === 'string') return `${url}?${new URLSearchParams({ page })}`
      return `${url.path}?${new URLSearchParams({ page, ...url.searchParams })}`
    },
    { revalidateFirstPage: false, ...config },
  )

  const flatData: ApiSchema[T]['data'] = data?.flatMap(({ data }) => data) ?? []
  const totalData = data?.[0]?.totalData
  const remainingItems = totalData != null ? totalData - flatData.length : 0

  const fetchMore = () => {
    if (error || !remainingItems || isValidating) return
    setSize((prev) => prev + 1)
  }

  const revalidateLast = () => setSize(size)

  return { error, isLoading, isValidating, data: flatData, totalData, remainingItems, fetchMore, revalidateLast }
}
