import { jwtVerify, SignJWT } from 'jose'

type TokenPayload = { verificationId: string; token: string }
const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)

export async function signJWTToken(payload: TokenPayload) {
  const jwt = new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
  return jwt.sign(JWT_KEY)
}

export async function verifyJWTToken(jwtToken: string): Promise<Partial<{ payload: TokenPayload }>> {
  try {
    const { payload } = await jwtVerify<TokenPayload>(jwtToken, JWT_KEY, { algorithms: ['HS256'] })
    return { payload }
  } catch {
    return { payload: undefined }
  }
}
