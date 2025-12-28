import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useServerAction } from '@/hooks/server-action'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { updateCartQtyAction } from '../actions'
import { useUserCartProducts } from '../hooks'

export default function UpdateCartQtyButton({ cartId, quantity }: { cartId: string; quantity: number }) {
  const { rawData, mutate } = useUserCartProducts()

  const action = useServerAction(updateCartQtyAction, {
    rateLimitKey: 'update-cart-qty',
    onError: ({ message }) => {
      toast.error(message)
      mutate()
    },
    onSuccess: () => {
      const newData = rawData!.map((page) => ({ ...page, data: page.data.map((cart) => (cart.id === cartId ? { ...cart, quantity } : cart)) }))
      mutate(newData, { revalidate: false })
    },
  })

  return (
    <Button
      size="icon-sm"
      disabled={action.rateLimiter.isLimit || action.isPending}
      className="animate-in zoom-in"
      onClick={() => action.execute({ cartId, quantity })}
    >
      {action.rateLimiter.isLimit ? <span>{action.rateLimiter.secondsLeft}</span> : action.isPending ? <Spinner /> : <RefreshCcw />}
      <span className="sr-only">update cart qty</span>
    </Button>
  )
}
