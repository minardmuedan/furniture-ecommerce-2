import { ProductImage } from '@/components/products'
import { getSubcategoryProductDb } from '@/db/utils/products'
import { categories, getCategoryTitle, type Subcategories, type Categories } from '@/lib/categories'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const generateStaticParams = () => Object.keys(categories).map((category) => ({ category }))

export default async function CategoryPage({ params }: { params: Promise<{ category: Categories }> }) {
  const { category } = await params
  if (!categories[category]) notFound()

  const subcategories = await Promise.all(
    Object.keys(categories[category].subcategories)
      .splice(0, 3)
      .map(async (subcategory) => ({ subcategory, product: await getSubcategoryProductDb(subcategory as Subcategories) })),
  )

  return subcategories.map(({ subcategory, product }, i) => (
    <Link key={subcategory} href={`/${category}/${subcategory}`} className={`${i == 0 ? 'col-span-6' : 'col-span-3'} sm:col-span-1`}>
      <div
        style={{ '--image-color': product?.image.color ?? 'var(--accent)' } as React.CSSProperties}
        className={cn(
          'flex h-full items-center rounded-md border px-12 py-3 transition-colors ease-out hover:bg-(--image-color)/35 sm:px-6',
          i === 0 ? 'flex-row gap-12 py-1 *:flex-1 sm:flex-col sm:gap-2 sm:py-3 sm:*:flex-none' : 'flex-col gap-2',
        )}
      >
        <ProductImage props={product?.image} />
        <h3 className="text-muted-foreground text-center text-sm font-normal uppercase">{getCategoryTitle(subcategory)}</h3>
      </div>
    </Link>
  ))
}
