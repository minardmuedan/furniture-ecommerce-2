import BackButton from '@/components/back-button'
import { InfiniteProducts } from '@/components/products'
import { SectionHeader, sectionTriggerStyle } from '@/components/sections'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { getCachedProduct, getCachedProductStock } from '@/lib/cached-products'
import { getCategoryTitle } from '@/lib/categories'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProductActionButtons, ProductDetailsColor, ProductDetailsImage } from './_components'
import { formatProductPrice } from '@/lib/utils'

export default async function ProductDetailsPage({ params }: PageProps<'/products/[productId]'>) {
  const { productId } = await params

  const product = await getCachedProduct(productId)
  if (!product) notFound()

  const productStocksPromise = getCachedProductStock(productId)
  return (
    <>
      <div
        style={{ '--image-color': product.image.color } as React.CSSProperties}
        className="to-background absolute inset-x-0 top-0 -z-1 aspect-video max-h-[65svh] w-full bg-linear-to-b from-(--image-color)/50"
      >
        <span className="sr-only">backdrop</span>
      </div>

      <div className={sectionTriggerStyle()}>
        <BackButton />

        <section className="mt-10 flex flex-col items-center gap-20 lg:flex-row lg:items-stretch lg:justify-center">
          <div className="relative">
            <div className="sticky top-16">
              <ProductDetailsImage images={[...Array(4)].map(() => product.image)} />
            </div>
          </div>

          <main className="max-w-[700px] space-y-14">
            <header>
              <span className="text-muted-foreground mb-1 text-xs">{`${getCategoryTitle(product.category)} > ${getCategoryTitle(product.subcategory)}`}</span>
              <h1 className="font-calstavier text-3xl md:text-4xl">{product.title}</h1>
            </header>

            <div>
              <h3 className="text-muted-foreground mb-1 text-sm">Available Color:</h3>
              <ProductDetailsColor colors={[product.image.color, '#EAD2C6', '#FF9A64', '#0A0A0A', '#FFFFF']} />
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h4 className="mb-1 text-2xl">{formatProductPrice(product.price)}</h4>

                <div className="text-muted-foreground flex gap-2 text-sm">
                  <span>stocks:</span>
                  <Suspense fallback={<Skeleton className="h-5 w-9" />}>
                    <ProductStocks productStocksPromise={productStocksPromise} />
                  </Suspense>
                </div>
              </div>

              <Suspense>
                <ProductActionButtons productId={product.id} productStocksPromise={productStocksPromise} />
              </Suspense>
            </div>

            <p className="text-muted-foreground text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit autem sint excepturi consequuntur aliquid dolores molestiae dolor, id
              adipisci illo esse cupiditate laudantium rerum vero eum molestias exercitationem. Quibusdam, in! Omnis, expedita eos aliquid perferendis
              tenetur quasi praesentium cumque in dolore maiores numquam totam atque explicabo facere at ut mollitia.
            </p>

            <Accordion type="multiple">
              {['Material used', 'Other details'].map((label, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="data-[state=closed]:text-muted-foreground">{label}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque suscipit id, distinctio repellendus recusandae quae veritatis
                    illo quas totam laborum?
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </main>
        </section>

        <section className="mt-40">
          <SectionHeader as="h2">browse {getCategoryTitle(product.subcategory)}</SectionHeader>
          <InfiniteProducts filters={{ category: product.category, subcategory: product.subcategory }} />
        </section>
      </div>
    </>
  )
}

const ProductStocks = async ({ productStocksPromise }: { productStocksPromise: Promise<number> }) => await productStocksPromise
