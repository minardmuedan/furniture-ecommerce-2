'use client'

import { Button } from '@/components/ui/button'
import { useSession } from './session-provider'

export default function Homepage() {
  const session = useSession()

  return (
    <div>
      {JSON.stringify({ session })}

      <Button
        onClick={() => {
          session.optimisticallyUpdateSession({ sessionId: '123', user: { email: 'asd', username: 'asd' } })
        }}
      >
        Set session
      </Button>
    </div>
  )
}
