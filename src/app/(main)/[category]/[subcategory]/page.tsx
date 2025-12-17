import BackButton from '@/components/back-button'
import { InfiniteProducts } from '@/components/products'
import { sectionTriggerStyle } from '@/components/sections'
import { categories, type Categories, getCategoryTitle, type Subcategories, subcategories } from '@/lib/categories'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return Object.entries(categories).flatMap(([category, { subcategories }]) =>
    Object.keys(subcategories).map((subcategory) => ({ category, subcategory })),
  )
}

export default async function SubcategoryPage({ params }: { params: Promise<{ category: Categories; subcategory: Subcategories }> }) {
  const { category, subcategory } = await params
  if (!categories[category]) notFound()
  if (!Object.keys(categories[category].subcategories).includes(subcategory)) notFound()

  return (
    <div className={sectionTriggerStyle()}>
      <BackButton />

      <header className="mb-26 flex flex-col items-center gap-2">
        <span className="text-muted-foreground/75 mt-2 mb-20 text-xs">{`${getCategoryTitle(category)} > ${getCategoryTitle(subcategory)}`}</span>
        <h1 className="font-calstavier mt-1 mb-2 text-4xl uppercase md:text-5xl">{getCategoryTitle(subcategory)}</h1>
        <p className="text-muted-foreground text-sm">{subcategories[subcategory].description}</p>
      </header>

      <section>
        <InfiniteProducts subcategory={subcategory} />
      </section>
    </div>
  )
}
