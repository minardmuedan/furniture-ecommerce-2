import { PageDescription, PageHeader, PageTitle } from '@/components/page-header'
import { Section } from '@/components/sections'
import InfiniteProducts from '@/features/products/components/infinite-products'

export default function ProductsPage() {
  return (
    <Section>
      <PageHeader className="my-30">
        <PageTitle withLogo size="lg">
          PRODUCTS
        </PageTitle>
        <PageDescription>Browse all products</PageDescription>
      </PageHeader>

      <main>
        <InfiniteProducts />
      </main>
    </Section>
  )
}
