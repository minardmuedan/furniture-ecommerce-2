import { Minus, Plus } from 'lucide-react'
import { useEffect, useState, type ChangeEvent } from 'react'
import UpdateCartQtyButton from './update-qty-btn'

export default function CartQuantity({ cartId, defaultQuantity, max }: { cartId: string; defaultQuantity: number; max: number }) {
  const [quantity, setQuantity] = useState(defaultQuantity)
  const [isDifferent, setIsDifferent] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (val === '') {
      setQuantity('' as unknown as number)
      return
    }

    const numVal = parseInt(val, 10)
    if (!isNaN(numVal) && numVal >= 1) setQuantity(numVal)
  }

  const handleBlur = () => {
    if (typeof quantity !== 'number' || isNaN(quantity)) setQuantity(defaultQuantity)
    if (quantity >= max) setQuantity(max)
  }

  useEffect(() => {
    if (quantity !== defaultQuantity && quantity !== ('' as unknown)) setIsDifferent(true)
    else setIsDifferent(false)
  }, [quantity, defaultQuantity])

  return (
    <div className="flex items-center gap-2">
      <div className="[&>button]:text-muted-foreground flex w-fit items-center rounded-md border px-1 [&>button]:h-8 [&>button]:disabled:pointer-events-none [&>button]:disabled:opacity-25 *:[&>svg]:size-5">
        <button aria-label="increment" disabled={quantity <= 1} onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>
          <Minus />
        </button>
        <input type="text" maxLength={3} value={quantity} onChange={handleInputChange} onBlur={handleBlur} className="w-8 text-center text-sm" />
        <button aria-label="increment" disabled={quantity >= max} onClick={() => setQuantity((prev) => Math.min(prev + 1, max))}>
          <Plus />
        </button>
      </div>

      {isDifferent && <UpdateCartQtyButton cartId={cartId} quantity={quantity} />}
    </div>
  )
}
