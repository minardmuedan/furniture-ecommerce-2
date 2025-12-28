import InfiniteCartProducts from '@/features/user-cart/components/infinite-cart-products'

export default function UserCartPage() {
  return (
    <>
      <h1 className="text-muted-foreground mb-6">Your Cart</h1>
      <InfiniteCartProducts />
    </>
  )
}
