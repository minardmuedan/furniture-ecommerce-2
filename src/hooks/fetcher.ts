import type { ApiSchema, PaginatedApiRoutes } from '@/types/routes'
import useSWR, { type SWRConfiguration } from 'swr'
import useSWRInfinite, { type SWRInfiniteConfiguration } from 'swr/infinite'

export function useFetcher<T extends keyof ApiSchema>(url: T, config?: SWRConfiguration<ApiSchema[T]>) {
  return useSWR<ApiSchema[T]>(url, config)
}

export function useInfiniteFetcher<T extends PaginatedApiRoutes>(
  url: T | { path: T; searchParams?: Partial<Record<string, string>> },
  config?: SWRInfiniteConfiguration<ApiSchema[T]>,
) {
  const { data, size, setSize, error, isLoading, isValidating, mutate } = useSWRInfinite<ApiSchema[T], { message: string }>(
    (pageIndex) => {
      const page = `${pageIndex + 1}`
      if (typeof url === 'string') return `${url}?${new URLSearchParams({ page })}`
      return `${url.path}?${new URLSearchParams({ page, ...url.searchParams })}`
    },
    { revalidateFirstPage: false, ...config },
  )

  const flatData: ApiSchema[T]['data'] = data?.flatMap((d) => d.data as any) ?? []
  const totalData = data?.[0]?.totalData || 0
  const remainingItems = totalData != null ? totalData - flatData.length : 0

  const fetchMore = () => {
    if (error || !remainingItems || isValidating) return
    setSize((prev) => prev + 1)
  }

  const revalidateLast = () => setSize(size)

  return { error, isLoading, isValidating, rawData: data, data: flatData, totalData, remainingItems, mutate, fetchMore, revalidateLast }
}
