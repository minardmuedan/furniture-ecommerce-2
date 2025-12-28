import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CheckoutButton({ productId }: { productId: string }) {
  return (
    <Button className="group">
      Checkout <ArrowRight className="transition-transform group-hover:translate-x-1" />
    </Button>
  )
}
