import { eq } from 'drizzle-orm'
import { db } from '..'
import { userCartTable } from '../schema'

export const createUserCartDb = async (values: typeof userCartTable.$inferInsert) => await db.insert(userCartTable).values(values)

export const getUserCartProductIdsDb = async (userId: string) =>
  await db.query.userCartTable.findMany({
    columns: { productId: true },
    where: (cart, { eq }) => eq(cart.userId, userId),
  })

export const getUserCartProductsDb = async ({ userId, page }: { userId: string; page: number }) => {
  const filter = eq(userCartTable.userId, userId)

  const [cartData, totalCartData] = await Promise.all([
    db.query.userCartTable.findMany({
      columns: { userId: false, createdAt: false },
      with: { product: { columns: { createdAt: false, updatedAt: false }, with: { stocks: { columns: { availableQuantity: true } } } } },
      limit: 20,
      offset: (page - 1) * 20,
      where: filter,
      orderBy: (cart, { desc }) => [desc(cart.createdAt), desc(cart.id)],
    }),

    page === 1 ? db.$count(userCartTable, filter) : 0,
  ])

  return { cartData, totalCartData }
}

export const getCartDb = async (id: string) => await db.query.userCartTable.findFirst({ where: (cart, { eq }) => eq(cart.id, id) })

export const updateCartDb = async (cartId: string, values: Partial<Pick<typeof userCartTable.$inferInsert, 'quantity' | 'price'>>) =>
  await db.update(userCartTable).set(values).where(eq(userCartTable.id, cartId))
