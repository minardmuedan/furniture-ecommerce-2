import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import VerifyEmailButton from '@/features/auth/signup/verification/verify-button'

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>Click the button below to verify</CardDescription>
      </CardHeader>

      <CardContent>
        <VerifyEmailButton />
      </CardContent>
    </Card>
  )
}
