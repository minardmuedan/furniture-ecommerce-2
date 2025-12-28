import { db } from '..'

export const getProductStocksDb = async (id: string) =>
  await db.query.productStocksTable.findFirst({ where: ({ productId }, { eq }) => eq(productId, id), columns: { availableQuantity: true } })
