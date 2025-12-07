'use client'

import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/session'
import { useRouter } from 'next/navigation'

export default function Homepage() {
  const router = useRouter()
  const session = useSession()

  return (
    <div className="min-h-svhminusnav flex flex-col items-center justify-center gap-5">
      <Button onClick={() => router.refresh()}>Refresh</Button>
      <Button
        onClick={() => {
          session.setUser({ email: 'menard@emai.ocm', username: 'minard' })
          router.refresh()
        }}
      >
        set menard
      </Button>

      <pre>{JSON.stringify({ session }, null, 2)}</pre>
    </div>
  )
}
