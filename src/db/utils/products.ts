import type { Categories, Subcategories } from '@/lib/categories'
import { and, eq } from 'drizzle-orm'
import { db } from '..'
import { productsTable } from '../schema'

export const getProductsDb = async ({ page, category, subcategory }: { page: number; category?: Categories; subcategory?: Subcategories }) => {
  const conditions = []
  if (category) conditions.push(eq(productsTable.category, category))
  if (subcategory) conditions.push(eq(productsTable.subcategory, subcategory))

  const filters = conditions.length > 0 ? and(...conditions) : undefined

  const [products, totalProducts] = await Promise.all([
    db.query.productsTable.findMany({
      columns: { stocks: false, description: false, createdAt: false, updatedAt: false },
      limit: 20,
      offset: (page - 1) * 20,
      where: filters,
      orderBy: (products, { asc }) => [asc(products.createdAt), asc(products.id)],
    }),
    page === 1 ? db.$count(productsTable, filters) : 0,
  ])

  return { products, totalProducts }
}

export const getSubcategoryProductDb = async (subcategory: Subcategories) =>
  await db.query.productsTable.findFirst({ where: (product, { eq }) => eq(product.subcategory, subcategory) })

export const getProductDb = async (id: string) =>
  await db.query.productsTable.findFirst({
    where: (product, { eq }) => eq(product.id, id),
    columns: { stocks: false, updatedAt: false },
  })
