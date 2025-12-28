import { Button, type buttonVariants } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useServerAction } from '@/hooks/server-action'
import type { VariantProps } from 'class-variance-authority'
import { LogOutIcon } from 'lucide-react'
import { toast } from 'sonner'
import { logoutAction } from './logout-action'
import { sessionStore } from '@/lib/zustand-store/session'
import { socketStore } from '@/lib/zustand-store/socket'

type Props = Omit<React.ComponentProps<'button'>, 'onClick'> & VariantProps<typeof buttonVariants>

export default function LogoutButton({ variant, disabled, ...props }: Props) {
  const { isHydrated, isPending, rateLimiter, execute } = useServerAction(logoutAction, {
    rateLimitKey: 'logout',
    onError: ({ message }) => toast.error(message),
    onSuccess: (_, router) => {
      toast.success('Logouted successfully, See you again!')
      router.push('/login')
      sessionStore.getState().invalidateSession()
      socketStore.getState().disconnectSocket()
    },
    onSettled: () => sessionStore.getState().revalidateSession(),
  })

  return (
    <Button
      disabled={!isHydrated || rateLimiter.isLimit || isPending || disabled}
      variant={variant ?? 'destructive'}
      onClick={() => execute()}
      {...props}
    >
      {isPending ? <Spinner /> : <LogOutIcon />} Logout {rateLimiter.isLimit && `${rateLimiter.secondsLeft}s`}
    </Button>
  )
}
