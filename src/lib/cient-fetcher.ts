type Success<T> = { isError?: false; data: T }
type Failure = { isError: true; message: string }

export async function clientFetch<T>(url: string, init: RequestInit | undefined, opt: { throwOnError: true }): Promise<T>

export async function clientFetch<T>(url: string, init?: RequestInit, opt?: { throwOnError?: false }): Promise<Success<T> | Failure>

export async function clientFetch<T>(
  url: string,
  init?: RequestInit,
  opt?: { throwOnError?: boolean },
): Promise<T | Success<T> | Failure> {
  try {
    const res = await fetch(url, init)
    if (!res.ok) throw new Error(`HTTP error: ${res.statusText}`)

    const data: T = await res.json()
    if (opt?.throwOnError) return data

    return { data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    if (opt?.throwOnError) throw new Error(message)
    return { isError: true, message }
  }
}
