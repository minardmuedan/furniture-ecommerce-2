import type { getUserCartProductsDb } from '@/db/utils/user-carts'
import type { Session } from './session'
import type { Product } from './products'

export type RedisSchema = {
  [key: `ratelimiter:${string}`]: { tokens: number; lastUsed: number }
  [key: `verification:email:${string}`]: { sessionId: string; token: string; expiresAt: number; user: { id: string; username: string } }
  [key: `verification:password:${string}`]: { token: string; expiresAt: number; user: { id: string; username: string } }
  [key: `session:${string}`]: { session: Session | null }
  [key: `product-stocks:${string}`]: number
  [key: `user-cart:${string}`]: string[]
  [key: `user-cart-products:${string}:${string}`]: {
    cartData: { id: string; price: string; productId: string; quantity: number; product: Product & { stocks: number } }[]
    totalCartData: number
  }
}

export type RedisPubSubSchema = {
  EMAIL_VERIFICATION_CHANNEL: { sessionId: string; message: string }
  INVALIDATE_SESSION_CHANNEL: { sessionId: string; message: string }
}
