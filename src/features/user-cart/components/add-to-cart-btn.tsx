import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useServerAction } from '@/hooks/server-action'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { addToCartAction } from '../actions'
import { useFetcher } from '@/hooks/fetcher'

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data: cartProductIds, mutate } = useFetcher('/api/user/cart')

  const { execute, isPending } = useServerAction(addToCartAction, {
    rateLimitKey: 'add-to-cart',
    onError: ({ message }) => {
      toast.error(message)
      mutate()
    },
    onSuccess: () => mutate([...(cartProductIds || []), productId]),
  })

  const isAlreadyInCart = cartProductIds?.includes(productId)

  return (
    <Button variant="secondary" disabled={isAlreadyInCart || isPending} onClick={() => execute({ productId, quantity: 1 })}>
      {isPending ? <Spinner /> : <ShoppingCart />}
      <span className="sr-only sm:not-sr-only"> {isAlreadyInCart ? 'Already added' : 'Add to cart'}</span>
    </Button>
  )
}
