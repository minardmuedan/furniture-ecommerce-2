'use server'

import { db } from '@/db'

export const memaAction = async (ids: string[]) => {
  console.log(await db.query.productsTable.findMany({ where: (products, { notInArray }) => notInArray(products.id, ids) }))
}
