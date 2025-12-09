export const clientFetch = async <T>(url: string, init: { onError?: (message: string) => void; onSuccess: (data: T) => void }) => {
  await new Promise((r) => setTimeout(r, 5000))
  try {
    const res = await fetch(url)
    if (!res.ok) throw null
    const data: T = await res.json()
    init.onSuccess(data)
  } catch {
    init.onError?.('Something went wrong!')
  }
}
