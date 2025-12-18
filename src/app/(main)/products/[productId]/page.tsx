import BackButton from '@/components/back-button'
import { InfiniteProducts, ProductImage } from '@/components/products'
import { SectionHeader, sectionTriggerStyle } from '@/components/sections'
import { Button } from '@/components/ui/button'
import { getProductDb } from '@/db/utils/products'
import { getCategoryTitle } from '@/lib/categories'
import { ArrowRight, Plus, ShoppingCart } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ProductDetailsPage({ params }: PageProps<'/products/[productId]'>) {
  await new Promise((r) => setTimeout(r, 5000))

  const { productId } = await params
  const product = await getProductDb(productId)
  if (!product) notFound()

  return (
    <>
      <section className="mt-10 flex flex-col items-center justify-center gap-20 lg:flex-row">
        <div>
          <ProductImage props={product.image} />

          <ul className="mt-4 flex max-w-[300px] gap-4 overflow-hidden px-4">
            {[...Array(4)].map((_, i) => (
              <li key={i} className={`border-foreground rounded p-1 ${i === 0 ? 'border' : ''}`}>
                <ProductImage props={product.image} />
              </li>
            ))}
          </ul>
        </div>

        <main className="space-y-14">
          <header>
            <span className="text-muted-foreground mb-1 text-xs">{`${getCategoryTitle(product.category)} > ${getCategoryTitle(product.subcategory)}`}</span>
            <h1 className="font-calstavier text-3xl md:text-4xl">{product.title}</h1>
          </header>

          <div>
            <h3 className="text-muted-foreground mb-1 text-sm">Available Color:</h3>
            <ul className="flex gap-4">
              {['#EAD2C6', '#FF9A64', '#0A0A0A', '#FFFFF'].map((backgroundColor, i) => (
                <li key={i} style={{ backgroundColor }} className="size-10 rounded-md border">
                  <span className="sr-only">color</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="text-2xl">₱{product.price}</h4>
              <span className="text-muted-foreground text-sm">stocks: {product.stocks}</span>
            </div>

            <div aria-label="actions" className="flex items-center gap-2">
              <Button variant="secondary" size="icon">
                <ShoppingCart />
                <span className="sr-only">add to cart</span>
              </Button>
              <Button className="group">
                Check Out <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground max-w-[700px] text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit autem sint excepturi consequuntur aliquid dolores molestiae dolor, id
            adipisci illo esse cupiditate laudantium rerum vero eum molestias exercitationem. Quibusdam, in! Omnis, expedita eos aliquid perferendis
            tenetur quasi praesentium cumque in dolore maiores numquam totam atque explicabo facere at ut mollitia.
          </p>

          <ul className="space-y-6">
            {['Material used', 'Other details'].map((label, i) => (
              <li key={i} className="text-muted-foreground flex h-10 justify-between border-b">
                <span className="text-sm">{label}</span>
                <Plus className="size-6 opacity-75" />
              </li>
            ))}
          </ul>
        </main>
      </section>

      <section className="mt-40">
        <SectionHeader as="h2">browse {getCategoryTitle(product.subcategory)}</SectionHeader>
        <InfiniteProducts filters={{ subcategory: product.subcategory }} />
      </section>
    </>
  )
}
