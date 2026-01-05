import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useServerAction } from '@/hooks/server-action'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { addToCartAction } from '../actions'
import { useDeleteUserCartProductsCache, useUserCartProductIds } from '../hooks'

export default function AddToCartButton({ productId }: { productId: string }) {
  const deleteUserCartProductsCache = useDeleteUserCartProductsCache()
  const { cartProductIds, mutate } = useUserCartProductIds()

  const action = useServerAction(addToCartAction, {
    rateLimitKey: 'add-to-cart',
    onError: ({ message }) => {
      toast.error(message)
      mutate()
    },
    onSuccess: () => mutate([...(cartProductIds || []), productId], { revalidate: false }),
    onSettled: () => deleteUserCartProductsCache(),
  })

  const isAlreadyInCart = cartProductIds?.includes(productId)

  return (
    <Button
      variant="secondary"
      disabled={action.rateLimiter.isLimit || isAlreadyInCart || action.isPending}
      onClick={() => action.execute({ productId })}
    >
      {action.isPending ? <Spinner /> : <ShoppingCart />}
      <span className="sr-only sm:not-sr-only"> {isAlreadyInCart ? 'Already added' : 'Add to cart'}</span>
    </Button>
  )
}
