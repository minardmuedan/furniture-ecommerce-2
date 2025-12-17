export default async function ProductDetailsPage({ params }: PageProps<'/products/[productId]'>) {
  const { productId } = await params
  return <div>{productId}</div>
}
