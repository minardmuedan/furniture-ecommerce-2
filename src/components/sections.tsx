import { cn } from '@/lib/utils'
import PlantLogo from './plant-logo'
import { cva } from 'class-variance-authority'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { AlertTriangle, RotateCcw } from 'lucide-react'

const sectionTriggerStyle = cva('px-4 sm:px-8 ')

function Section({ children, className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn(sectionTriggerStyle(), className)} {...props}>
      {children}
    </section>
  )
}

function SectionHeader({ as: Comp, children }: { as: 'h2' | 'h3'; children: React.ReactNode }) {
  return (
    <header className="mb-8 flex items-center justify-center gap-3">
      <PlantLogo />
      <Comp className="font-calstavier text-muted-foreground text-center text-xl uppercase">{children}</Comp>
    </header>
  )
}

function SectionError({ message }: { message: string }) {
  return (
    <Empty className="border-destructive border">
      <EmptyHeader className="text-destructive">
        <EmptyMedia variant="icon">
          <AlertTriangle className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{message}</EmptyTitle>
        <EmptyDescription>Please reload the page</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => window.location.reload()}>
          Reload <RotateCcw />
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export { Section, SectionHeader, SectionError, sectionTriggerStyle }
