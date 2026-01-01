'use client'

import { useFetcher } from '@/hooks/fetche'

export default function AboutPage() {
  const fetcher = useFetcher('/api/user/cart')

  return <pre>{JSON.stringify({ fetcher }, null, 2)}</pre>
}
