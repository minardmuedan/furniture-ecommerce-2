import { PageDescription, PageHeader, PageTitle } from '@/components/page-header'
import { sectionTriggerStyle } from '@/components/sections'
import { ButtonLink } from '@/components/ui/button'
import NoProduct from '@/features/products/components/no-product'
import { getCachedProducts } from '@/features/products/lib/product-data'
import { categories, getCategoryTitle } from '@/lib/categories'
import { typedObjectEntries } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { ExploreProducts } from './_components'

export default async function ExplorePage() {
  const categoriesAndProducts = await Promise.all(
    typedObjectEntries(categories).map(async ([category, { description }]) => ({
      category,
      description,
      productsData: await getCachedProducts({ page: 1, category }),
    })),
  )

  return (
    <>
      <PageHeader className="my-30">
        <PageTitle withLogo size="lg">
          EXPLORE
        </PageTitle>
        <PageDescription>Find Your Perfect Pieces</PageDescription>
      </PageHeader>

      {categoriesAndProducts.map(({ category, description, productsData }) => (
        <section key={category} className="min-h-svh">
          <PageHeader
            style={{ backgroundImage: `url(/categories/${category}.png)` }}
            className={sectionTriggerStyle({
              className:
                'after:from-background after:to-background/75 relative h-[50svh] max-h-[400px] overflow-hidden bg-cover bg-fixed bg-center *:relative *:z-1 after:absolute after:-inset-0.5 after:z-0 after:bg-linear-to-t md:items-start',
            })}
          >
            <PageTitle>{getCategoryTitle(category)}</PageTitle>
            <PageDescription>{description}</PageDescription>
          </PageHeader>

          <main className={sectionTriggerStyle()}>
            {productsData.totalProducts > 0 ? (
              <>
                <ExploreProducts products={productsData.products} />

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
