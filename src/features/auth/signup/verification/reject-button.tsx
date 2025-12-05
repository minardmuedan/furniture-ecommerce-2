'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { rejectSignupVerificationAction } from './actions'
import { Undo } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function RejectSignupVerificationButton() {
  const [isPending, setIsPending] = useState(false)

  async function handleReject() {
    setIsPending(true)
    await rejectSignupVerificationAction()
    setIsPending(false)
  }

  return (
    <Button disabled={isPending} variant="secondary" onClick={handleReject}>
      {isPending ? <Spinner /> : <Undo />} Back to Sign up
    </Button>
  )
}
