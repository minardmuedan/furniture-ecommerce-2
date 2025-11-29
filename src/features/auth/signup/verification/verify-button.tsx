'use client'

import { Button } from '@/components/ui/button'
import { verifyEmailAction } from './actions'

export default function VerifyEmailButton() {
  return <Button onClick={verifyEmailAction}>Verify my Email</Button>
}
