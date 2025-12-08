'use client'

import { Button } from '@/components/ui/button'
import { createSocket } from '@/socket-io/socket-client'

export default function Homepage() {
  return (
    <div>
      <Button onClick={() => createSocket(`${Date.now()}`, () => console.log('rewanewaewae'))}>Create Socket</Button>
    </div>
  )
}
