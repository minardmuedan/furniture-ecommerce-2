import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getVerificationTokenByTokenDb } from '@/db/utils/verifications'
import VerifyEmailButton from '@/features/auth/signup/verification/verify-button'
import { verifyJWTToken } from '@/lib/jwt-token'
import { notFound } from 'next/navigation'

export default async function VerifyEmailPage({ searchParams }: PageProps<'/signup/verify'>) {
  const { token: jwtToken } = await searchParams
  if (typeof jwtToken !== 'string') notFound()

  const jwt = await verifyJWTToken(jwtToken)
  if (!jwt?.token) notFound()

  const verificationTokenData = await getVerificationTokenByTokenDb(jwt.token, 'email-verification')
  if (!verificationTokenData) notFound()

  if (jwt.isExpired) {
    return <p>verification token is expired</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>Click the button below to verify</CardDescription>
      </CardHeader>

      <CardContent>
        <VerifyEmailButton jwtToken={jwtToken} />
      </CardContent>
    </Card>
  )
}
