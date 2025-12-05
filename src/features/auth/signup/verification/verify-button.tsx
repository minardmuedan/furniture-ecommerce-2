'use client'

import { Button } from '@/components/ui/button'
import { useServerAction } from '@/hooks/server-action'
import { toast } from 'sonner'
import { verifyEmailAction } from './actions'

export default function VerifyEmailButton({ jwtToken }: { jwtToken: string }) {
  const action = useServerAction(verifyEmailAction, {
    rateLimitKey: 'verify-email',
    onSuccess: (data, router) => {
      toast.success(data.message)
      router.replace(data.redirectTo)
    },
  })

  return (
    <Button disabled={action.isPending || action.rateLimiter.isLimit} onClick={() => action.execute({ jwtToken })}>
      {action.isPending ? 'Verifing your Email...' : 'Verify my Email'}
    </Button>
  )
}
