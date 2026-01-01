'use client'

import { Button } from '@/components/ui/button'
import { getAllKeys, useFetcher } from '@/hooks/fetche'
import { useState } from 'react'

export default function Homepage() {
  const [allKeys, setAllKeys] = useState([''])
  const fetcher = useFetcher('/api/user/cart')

  return (
    <>
      <Button
        onClick={() =>
          fetcher.mutate(
            (s) => {
              console.log({ s })
              return undefined
            },
            { revalidate: true },
          )
        }
      >
        revalidate
      </Button>

      <Button onClick={() => setAllKeys(getAllKeys())}>keys</Button>

      <pre>{JSON.stringify(allKeys, null, 2)}</pre>
      <pre>{JSON.stringify({ fetcher }, null, 2)}</pre>
    </>
  )
}
