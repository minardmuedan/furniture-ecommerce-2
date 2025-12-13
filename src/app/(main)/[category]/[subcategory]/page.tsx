import { categories, type AllSubcategories, type Categories } from '@/lib/categories'
import { notFound } from 'next/navigation'

export default async function SubcategoryPage({ params }: { params: Promise<{ category: Categories; subcategory: AllSubcategories }> }) {
  const { category, subcategory } = await params
  if (!Object.keys(categories[category].subcategories).includes(subcategory)) notFound()
  return <div>{subcategory}</div>
}
