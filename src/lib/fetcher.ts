import type { ApiSchema } from '@/types/routes'

type Success<T> = { isError?: false; data: T }
type Failure = { isError: true; message: string }

export async function fetcher<T extends keyof ApiSchema>(route: T, opt: { throwOnError: true }): Promise<ApiSchema[T]>

export async function fetcher<T extends keyof ApiSchema>(route: T, opt?: { throwOnError?: false }): Promise<Success<ApiSchema[T]> | Failure>

export async function fetcher<T extends keyof ApiSchema>(
  route: T,
  opt?: { throwOnError?: boolean },
): Promise<ApiSchema[T] | Success<ApiSchema[T]> | Failure> {
  try {
    const res = await fetch(route)
    if (!res.ok) throw new Error(`HTTP error: ${res.statusText}`)

    const data: ApiSchema[T] = await res.json()
    if (opt?.throwOnError) return data

    return { data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    if (opt?.throwOnError) throw new Error(message)
    return { isError: true, message }
  }
}
