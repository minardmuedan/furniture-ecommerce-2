import { redis } from '@/lib/redis'

export default async function Homepage() {
  return <div>{JSON.stringify({ s: await redis.keys('user-cart-products:ymisn939ipgwgmhepfmktruh:*') })}</div>
}
