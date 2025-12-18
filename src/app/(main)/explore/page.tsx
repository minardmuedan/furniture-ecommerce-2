import PlantLogo from '@/components/plant-logo'
import { NoProduct, ProductCard, ProductMapper } from '@/components/products'
import { sectionTriggerStyle } from '@/components/sections'
import { ButtonLink } from '@/components/ui/button'
import { getProductsDb } from '@/db/utils/products'
import { categories, getCategoryTitle } from '@/lib/categories'
import { typedObjectEntries } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export default async function ExplorePage() {
  const categoriesAndProducts = await Promise.all(
    typedObjectEntries(categories).map(async ([category, { description }]) => ({
      category,
      description,
      productsData: await getProductsDb({ page: 1, category }),
    })),
  )

  return (
    <>
      <header className="my-26 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <PlantLogo className="size-8" />
          <h1 className="font-calstavier text-4xl md:text-5xl">EXPLORE</h1>
        </div>
        <p className="text-muted-foreground text-sm">Find Your Perfect Pieces</p>
      </header>

      {categoriesAndProducts.map(({ category, description, productsData }) => (
        <section key={category} className="min-h-svh">
          <header
            style={{ backgroundImage: `url(/categories/${category}.png)` }}
            className={sectionTriggerStyle({
              className:
                'after:from-background after:to-background/75 relative flex h-[50svh] flex-col justify-center gap-2 overflow-hidden bg-cover bg-fixed bg-center text-center *:relative *:z-1 after:absolute after:-inset-0.5 after:z-0 after:bg-linear-to-t sm:text-start',
            })}
          >
            <h2 className="font-calstavier text-3xl">{getCategoryTitle(category)}</h2>
            <p className="text-muted-foreground text-sm">{description}</p>
          </header>

          <main className={sectionTriggerStyle()}>
            {productsData.totalProducts > 0 ? (
              <>
                <ProductMapper>
                  {productsData.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ProductMapper>

                <footer className="flex justify-center pt-10 pb-32">
                  <ButtonLink href={`/${category}`} variant="ghost" className="group text-muted-foreground">
                    More {getCategoryTitle(category)} products <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </ButtonLink>
                </footer>
              </>
            ) : (
              <NoProduct />
            )}
          </main>
        </section>
      ))}
    </>
  )
}
