import { Button } from '@/components/ui/button'
import { useServerAction } from '@/hooks/server-action'
import { Send } from 'lucide-react'
import { resendEmailVerificationAction } from '../actions'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

export default function ResendEmailVerificationButton() {
  const router = useRouter()
  const action = useServerAction(resendEmailVerificationAction, {
    rateLimitKey: 'resend-email-verification',
    onError: ({ message }) => {
      toast.error(message)
      router.refresh()
    },
  })

  return (
    <Button disabled={!action.isHydrated || action.isPending || action.rateLimiter.isLimit} onClick={action.execute}>
      {action.isPending ? <Spinner /> : <Send />} Resend{' '}
      {action.rateLimiter.isLimit ? `after ${action.rateLimiter.secondsLeft} second/s` : 'Verification'}
    </Button>
  )
}
