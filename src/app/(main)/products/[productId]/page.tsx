import BackButton from '@/components/back-button'
import { InfiniteProducts } from '@/components/products'
import { SectionHeader, sectionTriggerStyle } from '@/components/sections'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { getCachedProduct } from '@/lib/cached-products'
import { getCategoryTitle } from '@/lib/categories'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ProductDetailsColor, ProductDetailsImage } from './_components'

export default async function ProductDetailsPage({ params }: PageProps<'/products/[productId]'>) {
  const { productId } = await params
  const product = await getCachedProduct(productId)
  if (!product) notFound()

  return (
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
            <ProductDetailsColor colors={['#EAD2C6', '#FF9A64', '#0A0A0A', '#FFFFF']} />
          </div>

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <h4 className="text-2xl">₱{product.price}</h4>
              <span className="text-muted-foreground text-sm">stocks: todo: add watch stocks here </span>
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

          <p className="text-muted-foreground text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit autem sint excepturi consequuntur aliquid dolores molestiae dolor, id
            adipisci illo esse cupiditate laudantium rerum vero eum molestias exercitationem. Quibusdam, in! Omnis, expedita eos aliquid perferendis
            tenetur quasi praesentium cumque in dolore maiores numquam totam atque explicabo facere at ut mollitia.
          </p>

          <Accordion type="multiple">
            {['Material used', 'Other details'].map((label, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="data-[state=closed]:text-muted-foreground">{label}</AccordionTrigger>
                <AccordionContent>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque suscipit id, distinctio repellendus recusandae quae veritatis illo
                  quas totam laborum?
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
  )
}
