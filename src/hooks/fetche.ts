import { fetcher } from '@/lib/fetcher'
import type { ApiSchema, PaginatedApiRoutes } from '@/types/routes'
import { useLayoutEffect, useState } from 'react'

type Mutate<R> = (value?: R | ((prevData?: R) => R | undefined), opts?: { revalidate: boolean }) => void

type UseFetcher<R extends ApiSchema[keyof ApiSchema]> = {
  isInitializing: boolean
  isFetching: boolean
  data: R | undefined
  error: { message: string } | undefined
  mutate: Mutate<R | undefined>
  revalidate: () => Promise<void>
}

const cache = new Map()
const listeners = new Map<string, Set<(v: any) => void>>()

const notify = (key: string, value: any) => listeners.get(key)?.forEach((fn) => fn(value))

const getAllKeys = () => Array.from(cache.keys()) as (keyof ApiSchema)[]

const globalMutate = <T extends keyof ApiSchema>(key: T, value: ApiSchema[T] | undefined) => cache.set(key, value)

const useFetcher = <T extends keyof ApiSchema>(key: T): UseFetcher<ApiSchema[T]> => {
  type Value = ApiSchema[T] | undefined
  const [isInitializing, setIsInitializing] = useState(!cache.has(key))
  const [isFetching, setIsFetching] = useState(!cache.has(key))
  const [data, setData] = useState<Value>(cache.get(key))
  const [error, setError] = useState<{ message: string }>()

  const revalidate = async () => {
    setIsFetching(true)
    const res = await fetcher(key)
    if (res.isError) setError({ message: res.message })
    else {
      cache.set(key, res.data)
      notify(key, res.data)
    }

    setIsFetching(false)
    setIsInitializing(false)
  }

  useLayoutEffect(() => {
    if (!listeners.has(key)) listeners.set(key, new Set())
    const set = listeners.get(key)!
    set.add(setData)

    const cached = cache.get(key)
    if (!cached) revalidate()
    else setData(cached)

    return () => {
      set.delete(setData)
      if (set.size === 0) listeners.delete(key)
    }
  }, [key])

  const mutate: Mutate<Value> = (newValue, opts) => {
    const newData = typeof newValue === 'function' ? newValue(data) : newValue
    cache.set(key, newData)
    notify(key, newData)
    if (opts?.revalidate) revalidate()
  }

  return { isInitializing, isFetching, data, error, mutate, revalidate }
}

const useInfiniteFetcher = <T extends PaginatedApiRoutes>(key: T, searchParams?: Partial<Record<string, string>>) => {
  type Value = ApiSchema[T] | undefined
  const [page, setPage] = useState(1)
  const [infiniteData, setInfiniteData] = useState<Value>(cache.get(key))
  const {} = useFetcher(`${key}?${new URLSearchParams({ ...searchParams, page: page.toString() })}`)
}

export { getAllKeys, useFetcher, globalMutate }
