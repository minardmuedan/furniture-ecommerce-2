import z from 'zod'

export const addToCartSchema = z.object({ productId: z.string() })

export const updateCartQtySchema = z.object({ cartId: z.string(), quantity: z.number() })

export const deleteCartSchema = z.object({ cartIds: z.array(z.string()) })
