import type { Categories, Subcategories } from '@/lib/categories'
import { and, eq } from 'drizzle-orm'
import { db } from '..'
import { productsTable } from '../schema'

export const getProductsDb = async ({ page, category, subcategory }: { page: number; category?: Categories; subcategory?: Subcategories }) => {
  const filters = and(
    category ? eq(productsTable.category, category) : undefined,
    subcategory ? eq(productsTable.subcategory, subcategory) : undefined,
  )

  const [products, totalProducts] = await Promise.all([
    db.query.productsTable.findMany({
      limit: 20,
      offset: (page - 1) * 20,
      where: filters,
      orderBy: (products, { asc }) => [asc(products.createdAt), asc(products.id)],
      columns: { createdAt: false, updatedAt: false },
    }),
    page === 1 ? db.$count(productsTable, filters) : 0,
  ])

  return { products, totalProducts }
}

export const getSubcategoryProductDb = async (subcategory: Subcategories) =>
  await db.query.productsTable.findFirst({ where: (product, { eq }) => eq(product.subcategory, subcategory) })

export const getProductDb = async (id: string) => await db.query.productsTable.findFirst({ where: (product, { eq }) => eq(product.id, id) })
