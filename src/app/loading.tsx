import { Spinner } from '@/components/ui/spinner'

export default function RootLoading() {
  return (
    <div className="min-h-svhminusnav text-muted-foreground grid place-items-center">
      <span className="sr-only">root loading</span>
      <Spinner />
    </div>
  )
}
