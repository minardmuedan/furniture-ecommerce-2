import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import VerifyEmailButton from '@/features/auth/signup/verification/verify-button'
import { verifyJWTToken } from '@/lib/jwt-token'
import { redis } from '@/lib/redis'
import { notFound } from 'next/navigation'

export default async function VerifyEmailPage({ searchParams }: PageProps<'/signup/verify'>) {
  const { token: jwtToken } = await searchParams
  if (typeof jwtToken !== 'string') notFound()

  const { payload } = await verifyJWTToken(jwtToken)
  if (!payload) notFound()

  const verificationData = await redis.get(`verification:email:${payload.verificationId}`)
  if (!verificationData) notFound()

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
