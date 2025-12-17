'use client'

import { fetcher } from '@/lib/fetcher'
import { SWRConfig } from 'swr'

export function SWRConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => fetcher(url, { throwOnError: true }),
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  )
}
