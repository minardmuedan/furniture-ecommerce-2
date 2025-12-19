import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import PlantLogo from './plant-logo'

const PageHeader = ({ children, className, ...props }: React.ComponentProps<'section'>) => {
  return (
    <header className={cn('flex flex-col items-center justify-center gap-2 text-center', className)} {...props}>
      {children}
    </header>
  )
}

const pageTitleVariants = cva('font-calstavier uppercase', {
  variants: { size: { default: 'text-3xl  md:text-4xl', lg: 'text-4xl md:text-5xl' } },
  defaultVariants: { size: 'default' },
})

const PageTitle = ({
  children,
  size,
  className,
  withLogo,
  as,
}: { children: React.ReactNode; className?: string; withLogo?: boolean; as?: 'h2' } & VariantProps<typeof pageTitleVariants>) => {
  const Comp = as ? as : 'h1'
  const Title = () => <Comp className={cn(pageTitleVariants({ className, size }))}>{children}</Comp>

  if (withLogo)
    return (
      <div className="flex items-start gap-4">
        <PlantLogo className="size-10" />
        <Title />
      </div>
    )

  return <Title />
}

const PageDescription = ({ children, className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  )
}

export { PageDescription, PageHeader, PageTitle }
