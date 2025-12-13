import { categories, type Categories } from '@/lib/categories'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ category: Categories }> }) {
  const { category } = await params
  if (!Object.keys(categories).includes(category)) notFound()

  return (
    <div>
      {category}
      <ul className="flex flex-col gap-6">
        {Object.entries(categories[category].subcategories).map(([subcategory, { title }]) => (
          <li key={subcategory}>
            <Link href={`/${category}/${subcategory}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }))
}
