'use server'

import { createUserCartDb, deleteUserCartDb, getCartDb, updateUserCartDb } from '@/db/utils/user-carts'
import { createAuthedServerAction } from '@/lib/server-actions/authed-server-action'
import { CustomError } from '@/lib/server-actions/server-action'
import { generateSecureRandomString } from '@/lib/utils'
import { addToCartSchema, deleteCartSchema, updateCartQtySchema } from './lib/schema'
import { getCachedProduct, getCachedProductStock } from '../products/lib/product-data'
import { deleteCachedUserCart, deleteCachedUserCartProducts, getCachedUserCartProductIds } from './lib/cart-data'

export const addToCartAction = createAuthedServerAction(addToCartSchema)
  .ratelimit({ key: 'add-to-cart', capacity: 10, refillRate: 10, refillPerSeconds: 10 })
  .handle(async (session, { productId }) => {
    const id = generateSecureRandomString()

    const product = await getCachedProduct(productId)
    if (!product) throw new CustomError('not_found', 'Product dont exist, Please try again')

    const cartProductIds = await getCachedUserCartProductIds(session.user.id)
    if (cartProductIds.includes(product.id)) throw new CustomError('forbidden', 'Duplicate items, Please reload the page')
    const price = product.price.toString()

    await createUserCartDb({ id, userId: session.user.id, productId, quantity: 1, price })
    await deleteCachedUserCart(session.user.id)
  })

export const updateCartQtyAction = createAuthedServerAction(updateCartQtySchema)
  .ratelimit({ key: 'update-cart-qty', capacity: 10, refillRate: 10, refillPerSeconds: 10 })
  .handle(async (session, { cartId, quantity }) => {
    const cartData = await getCartDb(cartId)
    if (!cartData || cartData.userId !== session.user.id) throw new CustomError('not_found', 'Product data not found!')

    const availableStock = await getCachedProductStock(cartData.productId)
    if (quantity <= 0 || quantity > availableStock) throw new CustomError('not_found', 'Invalid product quantity')

    await updateUserCartDb(session.user.id, cartId, { quantity })
    await deleteCachedUserCartProducts(session.user.id)
  })

export const deleteCartAction = createAuthedServerAction(deleteCartSchema)
  .ratelimit({ key: 'delete-cart', capacity: 10, refillRate: 10, refillPerSeconds: 10 })
  .handle(async (session, { cartIds }) => {
    await deleteUserCartDb(session.user.id, cartIds)
    await deleteCachedUserCart(session.user.id)
  })
