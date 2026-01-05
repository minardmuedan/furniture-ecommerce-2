import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import ProductImage from '@/features/products/components/product-image'
import { useServerAction } from '@/hooks/server-action'
import { Trash2, X } from 'lucide-react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'
import { deleteCartAction } from '../actions'
import { useUserCartProductIds, useUserCartProducts } from '../hooks'
import { Skeleton } from '@/components/ui/skeleton'

type Props = { selectedIds: string[]; setSelectedIds: Dispatch<SetStateAction<string[]>> }

export default function CartProductsHeader({ selectedIds, setSelectedIds }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { mutate: cartProductIdsMutate } = useUserCartProductIds()
  const { data, totalData, isLoading, isValidating, mutate } = useUserCartProducts()

  const action = useServerAction(deleteCartAction, {
    rateLimitKey: 'delete-cart',
    onError: ({ message }) => {
      toast.error(message)
      mutate()
    },
    onSuccess: () => {
      const filteredData = data.filter(({ id }) => !selectedIds.includes(id))
      mutate(Array.from({ length: Math.ceil(filteredData.length / 20) }, (_, i) => ({ totalData, data: filteredData.slice(i * 20, i * 20 + 20) })))
      setSelectedIds([])
    },
    onSettled: () => cartProductIdsMutate(),
  })

  const toggleSelectAll = (value: boolean) => {
    if (value) setSelectedIds(data.map(({ id }) => id))
    else setSelectedIds([])
  }

  const actionExecute = () => (!isValidating ? action.execute({ cartIds: selectedIds }) : undefined)

  const isSelectedAll = !isValidating && selectedIds.length === data.length
  const selectedCartProducts = data.filter(({ id }) => selectedIds.includes(id))

  if (isLoading) return <CartProductsHeaderSkeleton />

  return (
    <header className="bg-background mb-2 flex h-8 items-center justify-between gap-2 px-1">
      <div className="flex items-center gap-2">
        <Checkbox
          id="toggle-select-all"
          checked={isSelectedAll ? true : selectedIds.length > 0 ? 'indeterminate' : false}
          onCheckedChange={toggleSelectAll}
        />
        <Label htmlFor="toggle-select-all" className="font-light">
          {selectedIds.length > 0 ? `(${selectedIds.length} out of ${totalData})` : 'Select all'}{' '}
          <span className="text-muted-foreground">{isSelectedAll && totalData && selectedIds.length < totalData && 'Please scroll further'}</span>
        </Label>
      </div>

      {selectedIds.length > 0 &&
        (selectedIds.length <= 1 ? (
          <Button
            variant="ghost"
            className="hover:text-destructive/75 text-destructive"
            disabled={isValidating || action.isPending || action.rateLimiter.isLimit}
            onClick={actionExecute}
          >
            {action.isPending ? <Spinner /> : <Trash2 />}
            Delete
          </Button>
        ) : (
          <AlertDialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="hover:text-destructive/75 text-destructive">
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="gap-0 pb-0 md:max-w-xl lg:max-w-2xl">
              <AlertDialogHeader className="mb-4">
                <AlertDialogTitle>
                  Delete {selectedIds.length} cart item{selectedIds.length > 1 && 's'}?
                </AlertDialogTitle>
                <AlertDialogDescription>Are you sure that you want to delete {selectedIds.length > 1 ? 'these' : 'this'}?</AlertDialogDescription>
              </AlertDialogHeader>

              <ul className="space-y-2">
                {selectedCartProducts.map(({ id, product }) => (
                  <li key={id} className="flex items-center justify-between gap-5 border-b px-2 py-1 last-of-type:border-none">
                    <div className="flex items-center gap-3">
                      <ProductImage props={product.image} className="w-12" />
                      <p className="text-sm">{product.title}</p>
                    </div>

                    <Button
                      onClick={() => {
                        if (selectedIds.length === 1) setDialogOpen(false)
                        setSelectedIds((prev) => prev.filter((cartId) => cartId !== id))
                      }}
                      size="icon-sm"
                      variant="ghost"
                      className="text-muted-foreground/50"
                    >
                      <X />
                      <span className="sr-only">remove</span>
                    </Button>
                  </li>
                ))}
              </ul>

              <AlertDialogFooter className="bg-background sticky -bottom-6 pt-4 pb-6">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" disabled={action.isPending || action.rateLimiter.isLimit} onClick={actionExecute}>
                  Delete {action.rateLimiter.isLimit && `after ${action.rateLimiter.secondsLeft}`}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
    </header>
  )
}

function CartProductsHeaderSkeleton() {
  return (
    <div className="mb-2 flex h-8 items-center gap-2 px-1">
      <Skeleton className="size-4" />
      <Skeleton className="h-3.5 w-[70px]" />
    </div>
  )
}
