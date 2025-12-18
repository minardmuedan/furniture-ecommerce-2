import BackButton from '@/components/back-button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

export default function NotFound() {
  return (
    <div className="min-h-svhminusnav flex items-center justify-center border-t">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>The page you're looking for doesn't exist.</EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <BackButton variant="default" className="text-primary-foreground" />
        </EmptyContent>
      </Empty>
    </div>
  )
}
