import { InView } from 'react-intersection-observer'
import { Spinner } from './ui/spinner'

export function InfiniteLoader({ isPending, remainingItems, fetchMore }: { isPending: boolean; remainingItems: number; fetchMore: () => void }) {
  return (
    <div className="text-muted-foreground flex justify-center pt-10 pb-6 text-sm">
      {isPending || remainingItems > 0 ? (
        <InView key={remainingItems} onChange={(inview) => inview && fetchMore()} rootMargin="150px 0px">
          <span className="sr-only">trigger fetch more</span>
          <Spinner />
        </InView>
      ) : (
        <span>You&apos;re all caught up!</span>
      )}
    </div>
  )
}
