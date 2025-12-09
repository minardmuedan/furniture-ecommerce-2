import { DAY_IN_MS, FIFTEEN_MINUTES_IN_MS } from '@/lib/data-const'
import { redis } from '@/lib/redis'
import { CustomError } from '@/lib/server-action'
import { generateSecureRandomString } from '@/lib/utils'
import { jwtVerify, SignJWT } from 'jose'

const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)
type EP = 'email' | 'password'

export const createVerificationToken = async (type: EP, data: { sessionId: string; user: { username: string; email: string } }) => {
  const id = generateSecureRandomString()
  const token = generateSecureRandomString(28)
  const expiresAt = Date.now() + FIFTEEN_MINUTES_IN_MS
  await redis.set(`verification:${type}:${id}`, { token, expiresAt, ...data }, { expiration: { type: 'PX', value: DAY_IN_MS } })

  const jwtToken = await new SignJWT({ id, token }).setProtectedHeader({ alg: 'HS256' }).sign(JWT_KEY)
  return { id, jwtToken }
}

export const verifyVerificationToken = async (jwtToken: string) =>
  await jwtVerify<{ id: string; token: string }>(jwtToken, JWT_KEY, { algorithms: ['HS256'] })
    .then(({ payload }) => payload)
    .catch(() => null)

export const getVerificationToken = async (type: EP, id: string) => {
  const tokenData = await redis.get(`verification:${type}:${id}`)
  if (!tokenData) throw new CustomError('not_found', 'Verification token not found!')
  if (Date.now() > tokenData.expiresAt) throw new CustomError('expired', 'Verification token is expired!')
  return tokenData
}

export const deleteVerificationToken = async (type: EP, id: string) => await redis.del(`verification:${type}:${id}`)
