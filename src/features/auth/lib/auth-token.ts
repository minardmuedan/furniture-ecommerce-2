import { DAY_IN_MS, FIFTEEN_MINUTES_IN_MS } from '@/lib/data-const'
import { redis } from '@/lib/redis'
import { CustomError } from '@/lib/server-actions/server-action'
import { generateSecureRandomString } from '@/lib/utils'
import type { RedisSchema } from '@/types/redis'
import { jwtVerify, SignJWT } from 'jose'
import type { SetOptions } from 'redis'

type E_OR_P = 'email' | 'password'
type User = { id: string; username: string }
type EmailVerificationDataParams = { sessionId: string; user: User }
type PasswordVerificationDataParams = { user: User }

const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)

async function createVerificationToken(type: 'email', email: string, data: EmailVerificationDataParams): Promise<{ jwtToken: string }>
async function createVerificationToken(type: 'password', email: string, data: PasswordVerificationDataParams): Promise<{ jwtToken: string }>
async function createVerificationToken(type: E_OR_P, email: string, data: EmailVerificationDataParams | PasswordVerificationDataParams) {
  const token = generateSecureRandomString(28)
  const expiresAt = Date.now() + FIFTEEN_MINUTES_IN_MS
  const redisOptions: SetOptions = { expiration: { type: 'PX', value: DAY_IN_MS / 2 } }

  if (type === 'email') {
    const emailData = data as EmailVerificationDataParams
    await redis.set(`verification:email:${email}`, { token, expiresAt, ...emailData }, redisOptions)
  } else await redis.set(`verification:password:${email}`, { token, expiresAt, ...data }, redisOptions)

  return { jwtToken: await new SignJWT({ email, token }).setProtectedHeader({ alg: 'HS256' }).sign(JWT_KEY) }
}

type EmailVerificationFnReturn = RedisSchema[`verification:email:${string}`] & { email: string }
type PasswordVerificationFnReturn = RedisSchema[`verification:password:${string}`] & { email: string }

async function getVerificationToken(type: 'email', email: string): Promise<EmailVerificationFnReturn>
async function getVerificationToken(type: 'password', email: string): Promise<PasswordVerificationFnReturn>
async function getVerificationToken(type: E_OR_P, email: string): Promise<EmailVerificationFnReturn | PasswordVerificationFnReturn> {
  const tokenData = await redis.get(`verification:${type}:${email}`)
  if (!tokenData) throw new CustomError('not_found', '')
  if (Date.now() > tokenData.expiresAt) throw new CustomError('expired', '')
  return { email, ...tokenData }
}

async function getVerificationTokenByJwtToken(type: 'email', jwtToken: string): Promise<EmailVerificationFnReturn>
async function getVerificationTokenByJwtToken(type: 'password', jwtToken: string): Promise<PasswordVerificationFnReturn>
async function getVerificationTokenByJwtToken(type: E_OR_P, jwtToken: string): Promise<EmailVerificationFnReturn | PasswordVerificationFnReturn> {
  const { payload } = await jwtVerify<{ email: string; token: string }>(jwtToken, JWT_KEY, { algorithms: ['HS256'] })
  const tokenData = type === 'email' ? await getVerificationToken(type, payload.email) : await getVerificationToken(type, payload.email)
  if (tokenData.token !== payload.token) throw new CustomError('not_matched', '')
  return tokenData
}

const deleteVerificationToken = async (type: E_OR_P, email: string) => await redis.del(`verification:${type}:${email}`)

const verificationError = {
  not_found: 'Verification token not found!',
  not_matched: 'Verification token not matched!',
  expired: 'Verification token is expired!',
}

const isVerificationError = (error: string | string[] | undefined) => {
  if (typeof error === 'string' && ['not_found', 'not_matched', 'expired'].includes(error)) {
    return verificationError[error as keyof typeof verificationError]
  }
  return undefined
}

export { isVerificationError, createVerificationToken, getVerificationToken, getVerificationTokenByJwtToken, deleteVerificationToken }
