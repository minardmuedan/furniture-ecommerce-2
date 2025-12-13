import PlantLogo from '@/components/plant-logo'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import VerifyEmailButton from '@/features/auth/email-verification/action-buttons/verify-button'
import { getVerificationTokenByJwtToken } from '@/lib/auth-token'
import { getCookie } from '@/lib/headers'
import { CustomError } from '@/lib/server-action'
import { SESSION_COOKIE_KEY } from '@/lib/session'
import { notFound, redirect } from 'next/navigation'

export default async function VerifyEmailPage(props: PageProps<'/signup/verify'>) {
  try {
    const { token: jwtToken } = await props.searchParams
    if (typeof jwtToken !== 'string') notFound()

    const { email, sessionId } = await getVerificationTokenByJwtToken('email', jwtToken)
    const isSameDevice = (await getCookie(SESSION_COOKIE_KEY)) === sessionId

    return (
      <>
        <PlantLogo width={48} height={48} />

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              Click the button below to verify your email address <br /> <span className="text-foreground font-normal">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <VerifyEmailButton jwtToken={jwtToken} />
          </CardContent>

          {isSameDevice && (
            <CardFooter className="text-muted-foreground justify-center text-sm">You'll be automatically signed in after verification.</CardFooter>
          )}
        </Card>
      </>
    )
  } catch (err) {
    if (err instanceof CustomError) redirect(`/signup?error=${err.type}`)
    return notFound()
  }
}
