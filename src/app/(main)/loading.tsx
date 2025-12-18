import { Spinner } from '@/components/ui/spinner'

export default function RootLoading() {
  return (
    <div className="text-muted-foreground min-h-svhminusnav grid place-items-center">
      <span className="sr-only">root loading</span>
      <Spinner />
    </div>
  )
}
