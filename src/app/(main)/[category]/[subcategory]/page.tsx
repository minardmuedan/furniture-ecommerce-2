import { categories, type AllSubcategories, type Categories } from '@/lib/categories'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return Object.entries(categories).flatMap(([category, { subcategories }]) =>
    Object.keys(subcategories).map((subcategory) => ({ category, subcategory })),
  )
}

export default async function SubcategoryPage({ params }: { params: Promise<{ category: Categories; subcategory: AllSubcategories }> }) {
  const { category, subcategory } = await params
  if (!categories[category]) notFound()
  if (!Object.keys(categories[category].subcategories).includes(subcategory)) notFound()

  return <div>{subcategory}</div>
}
