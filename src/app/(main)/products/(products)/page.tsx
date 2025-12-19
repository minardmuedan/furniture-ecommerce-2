import { PageDescription, PageHeader, PageTitle } from '@/components/page-header'
import { InfiniteProducts } from '@/components/products'
import { Section } from '@/components/sections'

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
