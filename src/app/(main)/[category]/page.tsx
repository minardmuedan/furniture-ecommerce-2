import { db } from '@/db'
import { categories, type AllSubcategories, type Categories } from '@/lib/categories'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const generateStaticParams = () => Object.keys(categories).map((category) => ({ category }))

export default async function CategoryPage({ params }: { params: Promise<{ category: Categories }> }) {
  const { category } = await params
  if (!categories[category]) notFound()

  const subcategoryProduct = await Promise.all(
    Object.keys(categories[category].subcategories)
      .splice(0, 3)
      .map(async (subcategory) => {
        return await db.query.productsTable.findFirst({ where: (product, { eq }) => eq(product.subcategory, subcategory as AllSubcategories) })
      }),
  )

  const categoryProducts = await db.query.productsTable.findMany({ where: (product, { eq }) => eq(product.category, category), limit: 20 })

  return (
    <section className="px-4 md:px-8">
      <div aria-label="image backdrop" className="absolute inset-x-0 top-0 -z-1 aspect-video max-h-[65svh] w-full opacity-25">
        <Image src={`/categories/${category}.png`} alt={`${category} cover`} fill className="object-cover" />
        <div className="from-background to-background/0 absolute inset-0 bg-linear-to-t">
          <span className="sr-only">overlay</span>
        </div>
      </div>

      <header className="py-14 text-center md:text-start">
        <h1 className="font-calstavier text-3xl uppercase md:text-4xl">{categories[category].title}</h1>
        <p className="text-muted-foreground text-sm">{categories[category].description}</p>
      </header>

      <ul className="flex justify-center gap-24">
        {subcategoryProduct.map(
          (product) =>
            product && (
              <li key={product.id}>
                <div className="relative aspect-square w-[200px]">
                  <Image src={`/product-images/${product.image.src}/300.png`} alt="" fill className="object-cover" />
                </div>
                <p className="font-calstavier text-center text-xl uppercase">{product.subcategory.replace('-', ' ')}</p>
              </li>
            ),
        )}
      </ul>

      <h2 className="font-calstavier mt-20 mb-10 text-2xl uppercase">{categories[category].title} products </h2>
      <ul className="flex flex-wrap gap-20">
        {categoryProducts.map((product) => (
          <li key={product.id}>
            <div className="relative aspect-square w-[200px]">
              <Image src={`/product-images/${product.image.src}/300.png`} alt="" fill className="object-cover" />
            </div>
            <p>{product.title}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
