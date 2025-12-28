'use server'

import { createUserCartDb, getCartDb, updateCartDb } from '@/db/utils/user-carts'
import { getCachedProduct } from '@/lib/cached-products'
import { redis } from '@/lib/redis'
import { createAuthedServerAction } from '@/lib/server-actions/authed-server-action'
import { CustomError } from '@/lib/server-actions/server-action'
import { generateSecureRandomString } from '@/lib/utils'
import { addToCartSchema, updateCartQtySchema } from '@/types/zod-schema'
import { getCachedUserCartProductIds } from './lib/get-cart-data'

export const addToCartAction = createAuthedServerAction(addToCartSchema)
  .ratelimit({ key: 'add-to-cart', capacity: 10, refillRate: 10, refillPerSeconds: 10 })
  .handle(async (session, { productId, quantity }) => {
    const id = generateSecureRandomString()

    const product = await getCachedProduct(productId)
    if (!product) throw new CustomError('not_found', 'Product dont exist, Please try again')

    const cartProductIds = await getCachedUserCartProductIds(session.user.id)
    if (cartProductIds.includes(product.id)) throw new CustomError('forbidden', 'Duplicate items, Please reload the page')

    const price = (Number(product.price) * quantity).toString()
    await createUserCartDb({ id, userId: session.user.id, productId, quantity, price })
    await redis.del(`user-cart:${session.user.id}`)
  })

export const updateCartQtyAction = createAuthedServerAction(updateCartQtySchema)
  .ratelimit({ key: 'update-cart-qty', capacity: 10, refillRate: 10, refillPerSeconds: 10 })
  .handle(async (session, { cartId, quantity }) => {
    const cartData = await getCartDb(cartId)
    if (!cartData || cartData.userId !== session.user.id) throw new CustomError('not_found', 'Product data not found!')
    await updateCartDb(cartId, { quantity })
    await redis.delKeys(`user-cart-products:${session.user.id}:*`)
  })
