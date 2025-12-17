import { cn } from '@/lib/utils'
import PlantLogo from './plant-logo'
import { cva } from 'class-variance-authority'

const sectionTriggerStyle = cva('px-4 sm:px-8')

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

export { Section, SectionHeader, sectionTriggerStyle }
