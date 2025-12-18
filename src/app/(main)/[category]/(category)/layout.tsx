import { InfiniteProducts } from '@/components/products'
import { SectionHeader, sectionTriggerStyle } from '@/components/sections'
import { categories, getCategoryTitle, type Categories } from '@/lib/categories'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function Categorylayout({ params, children }: { params: Promise<{ category: Categories }>; children: React.ReactNode }) {
  const { category } = await params
  if (!categories[category]) notFound()

  return (
    <div className={sectionTriggerStyle({ className: 'space-y-40' })}>
      <div aria-label="image backdrop" className="absolute inset-x-0 top-0 -z-1 aspect-video max-h-[65svh] w-full opacity-25">
        <Image src={`/categories/${category}.png`} alt={`${category} cover`} priority fill quality={100} className="object-cover" />
        <div className="from-background to-background/0 absolute inset-0 bg-linear-to-t">
          <span className="sr-only">overlay</span>
        </div>
      </div>

      <header className="mt-20 text-center md:text-start">
        <h1 className="font-calstavier text-3xl uppercase md:text-4xl">{getCategoryTitle(category)}</h1>
        <p className="text-muted-foreground text-sm">{categories[category].description}</p>
      </header>

      <section>
        <SectionHeader as="h2">SUB CATEGORIES</SectionHeader>
        <nav className="grid grid-cols-6 justify-center gap-4 sm:grid-cols-3 md:grid-cols-[repeat(auto-fit,200px)] md:gap-8">{children}</nav>
      </section>

      <main className="pb-20">
        <SectionHeader as="h2">{getCategoryTitle(category)} products</SectionHeader>
        <InfiniteProducts filters={{ category }} />
      </main>
    </div>
  )
}
