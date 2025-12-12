import { DAY_IN_MS, FIFTEEN_MINUTES_IN_MS } from '@/lib/data-const'
import { redis } from '@/lib/redis'
import { CustomError } from '@/lib/server-action'
import { generateSecureRandomString } from '@/lib/utils'
import type { RedisSchema } from '@/types/redis'
import { jwtVerify, SignJWT } from 'jose'

type EP = 'email' | 'password'

const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)

const createToken = async (email: string) => {
  const token = generateSecureRandomString(28)
  const jwtToken = await new SignJWT({ email, token }).setProtectedHeader({ alg: 'HS256' }).sign(JWT_KEY)
  return { token, jwtToken }
}

export const verifyVerificationToken = async (jwtToken: string) =>
  (await jwtVerify<{ email: string; token: string }>(jwtToken, JWT_KEY, { algorithms: ['HS256'] })).payload

export const createEmailVerificationToken = async (data: {
  sessionId: string
  user: { id: string; username: string; email: string }
}) => {
  const { email } = data.user
  const { token, jwtToken } = await createToken(email)
  const expiresAt = Date.now() + FIFTEEN_MINUTES_IN_MS
  await redis.set(`verification:email:${email}`, { token, expiresAt, ...data }, { expiration: { type: 'PX', value: DAY_IN_MS / 2 } })
  return { jwtToken }
}

export const createPasswordVerificationToken = async (data: { user: { id: string; email: string } }) => {
  const { email } = data.user
  const { token, jwtToken } = await createToken(email)
  const expiresAt = Date.now() + FIFTEEN_MINUTES_IN_MS
  await redis.set(
    `verification:password:${email}`,
    { token, expiresAt, ...data },
    { expiration: { type: 'PX', value: DAY_IN_MS / 2 } },
  )
  return { jwtToken }
}

type VerificationTokenReturnType<TEP extends EP> = TEP extends 'email'
  ? RedisSchema[`verification:email:${string}`]
  : RedisSchema[`verification:password:${string}`]

export const getVerificationToken = async <TEP extends EP>(
  type: TEP,
  email: string,
  token?: string,
): Promise<VerificationTokenReturnType<TEP>> => {
  const tokenData = await redis.get(`verification:${type}:${email}`)
  if (!tokenData) throw new CustomError('not_found', 'Verification token not found!')

  if (token && tokenData.token !== token) throw new CustomError('not_matched', 'Verification token not matched!')

  if (Date.now() > tokenData.expiresAt) throw new CustomError('expired', 'Verification token is expired!')
  return tokenData as VerificationTokenReturnType<TEP>
}

export const deleteVerificationToken = async (type: EP, id: string) => await redis.del(`verification:${type}:${id}`)
