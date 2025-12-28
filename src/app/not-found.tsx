import BackButton from '@/components/back-button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

export default function NotFound() {
  return (
    <div className="min-h-svhminusnav flex items-center justify-center border-t">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="font-medium">
            <span className="text-4xl">404</span> <br /> PAGE NOT FOUND
          </EmptyTitle>
          <EmptyDescription>The page you're looking for doesn't exist.</EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <BackButton variant="default" className="text-primary-foreground" />
        </EmptyContent>
      </Empty>
    </div>
  )
}
