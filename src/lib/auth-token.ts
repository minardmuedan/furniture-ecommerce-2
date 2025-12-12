import { DAY_IN_MS, FIFTEEN_MINUTES_IN_MS } from '@/lib/data-const'
import { redis } from '@/lib/redis'
import { CustomError } from '@/lib/server-action'
import { generateSecureRandomString } from '@/lib/utils'
import { jwtVerify, SignJWT } from 'jose'

type EP = 'email' | 'password'
type DataParams = { sessionId: string; user: { id: string; username: string; email: string } }

const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)

export const createVerificationToken = async (type: EP, data: DataParams) => {
  const userEmail = data.user.email
  const token = generateSecureRandomString(28)
  const expiresAt = Date.now() + FIFTEEN_MINUTES_IN_MS
  await redis.set(
    `verification:${type}:${userEmail}`,
    { token, expiresAt, ...data },
    { expiration: { type: 'PX', value: DAY_IN_MS / 2 } },
  )

  const jwtToken = await new SignJWT({ email: userEmail, token }).setProtectedHeader({ alg: 'HS256' }).sign(JWT_KEY)
  return { jwtToken }
}

export const verifyVerificationToken = async (jwtToken: string) =>
  (await jwtVerify<{ email: string; token: string }>(jwtToken, JWT_KEY, { algorithms: ['HS256'] })).payload

export const getVerificationToken = async (type: EP, email: string, token?: string) => {
  const tokenData = await redis.get(`verification:${type}:${email}`)
  if (!tokenData) throw new CustomError('not_found', 'Verification token not found!')

  if (token && tokenData.token !== token) throw new CustomError('not_matched', 'Verification token not matched!')

  if (Date.now() > tokenData.expiresAt) throw new CustomError('expired', 'Verification token is expired!')
  return tokenData
}

export const deleteVerificationToken = async (type: EP, id: string) => await redis.del(`verification:${type}:${id}`)
