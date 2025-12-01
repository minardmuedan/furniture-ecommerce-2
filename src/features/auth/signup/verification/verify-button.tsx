'use client'

import { Button } from '@/components/ui/button'
import { useServerAction } from '@/hooks/server-action'
import { useRouter } from 'next/navigation'
import { verifyEmailAction } from './actions'
import { toast } from 'sonner'

export default function VerifyEmailButton({ jwtToken }: { jwtToken: string }) {
  const router = useRouter()

  const action = useServerAction(verifyEmailAction, {
    rateLimitKey: 'verify-email',
    onSuccess: (data) => {
      toast.success(data.message)
      router.replace(data.redirect)
    },
  })

  return (
    <Button disabled={action.isPending || action.rateLimiter.isLimit} onClick={() => action.execute({ jwtToken })}>
      {action.isPending ? 'Verifing your Email...' : 'Verify my Email'}
    </Button>
  )
}
