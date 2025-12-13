import { TriangleAlert } from 'lucide-react'

export default function FormError({ error }: { error?: string }) {
  if (error)
    return (
      <div className="text-destructive border-destructive bg-destructive/15 flex h-12 items-center gap-3 rounded-md border px-3 text-start">
        <TriangleAlert className="size-5" />
        <div title={error} className="flex-1 overflow-hidden text-sm font-normal text-ellipsis whitespace-nowrap">
          {error}
        </div>
      </div>
    )
}
