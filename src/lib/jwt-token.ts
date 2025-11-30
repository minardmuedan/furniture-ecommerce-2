import { jwtVerify, SignJWT } from 'jose'
import { JWTExpired } from 'jose/errors'

type TokenPayload = { token: string }
const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)

export async function signJWTToken(payload: TokenPayload, expiresInMinute?: number) {
  const jwt = new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
  if (expiresInMinute) jwt.setExpirationTime(`${expiresInMinute}m`)
  return jwt.sign(JWT_KEY)
}

type VerifyJWTReturnType = Partial<TokenPayload> & { isExpired?: boolean }
export async function verifyJWTToken(jwtToken: string): Promise<VerifyJWTReturnType> {
  try {
    const jwt = await jwtVerify<TokenPayload>(jwtToken, JWT_KEY, { algorithms: ['HS256'] })
    return { token: jwt.payload.token }
  } catch (err) {
    if (err instanceof JWTExpired) return { token: err.payload.token as string, isExpired: true }
    return { token: undefined }
  }
}
