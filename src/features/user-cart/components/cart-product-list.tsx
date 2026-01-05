import ProductImage from '@/features/products/components/product-image'
import type { CartDataProduct } from '@/types/products'
import CartQuantity from './cart-quantity'
import { Checkbox } from '@/components/ui/checkbox'

type Props = { cart: CartDataProduct; selectedIds: string[]; onSelect: () => void }

export default function CartProductList({ cart, selectedIds, onSelect }: Props) {
  const isSomeSelected = selectedIds.length > 0
  const isCartSelected = selectedIds.includes(cart.id)

  return (
    <li
      onClick={isSomeSelected ? onSelect : undefined}
      className={`group flex h-26 overflow-hidden rounded-xl border ${isCartSelected ? 'border-primary/40 bg-accent/50' : ''} ${isSomeSelected ? 'select-none *:pointer-events-none' : ''}`}
    >
      <div onClick={onSelect} className="flex items-center pr-5 pl-3 select-none">
        <span className="sr-only">check item</span>
        <Checkbox checked={isCartSelected} />
      </div>

      <div className="self-center">
        <ProductImage props={cart.product.image} className="w-20" />
      </div>

      <div className="flex flex-1 flex-col justify-between py-2 pl-5">
        <span className="text-sm">{cart.product.title}</span>
        <CartQuantity cartId={cart.id} defaultQuantity={cart.quantity} max={cart.product.stocks.availableQuantity} />
      </div>
    </li>
  )
}
