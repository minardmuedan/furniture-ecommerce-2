import BackButton from '@/components/back-button'
import { PageDescription, PageHeader, PageTitle } from '@/components/page-header'
import { Section } from '@/components/sections'
import InfiniteProducts from '@/features/products/components/infinite-products'
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
    <Section>
      <BackButton />

      <PageHeader className="mb-29">
        <span className="text-muted-foreground/75 mt-2 mb-20 text-xs">{getCategoryTitle(category)}</span>
        <PageTitle size="lg">{getCategoryTitle(subcategory)}</PageTitle>
        <PageDescription>{subcategories[subcategory].description}</PageDescription>
      </PageHeader>

      <main>
        <InfiniteProducts filters={{ category, subcategory }} />
      </main>
    </Section>
  )
}
