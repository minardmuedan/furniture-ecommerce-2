import VerifyEmailButton from '@/features/auth/email-verification/action-buttons/verify-button'
import { getVerificationToken, verifyVerificationToken } from '@/features/auth/helpers/token'
import { redis } from '@/lib/redis'
import { CustomError } from '@/lib/server-action'
import { notFound, redirect } from 'next/navigation'

export default async function VerifyEmailPage(props: PageProps<'/signup/verify'>) {
  try {
    const { token: jwtToken } = await props.searchParams
    if (typeof jwtToken !== 'string') notFound()

    const { email, token } = await verifyVerificationToken(jwtToken)
    const tokenData = await getVerificationToken('email', email, token)

    return (
      <div>
        <h1 className="text-2xl">Verify Email</h1>
        <div className="mt-2">hello {tokenData.user.username}</div>
        <p className="text-muted-foreground mt-2 mb-5 text-sm">Click the button below to verify</p>

        <form
          action={async () => {
            'use server'
            redis.publish('EMAIL_VERIFICATION_CHANNEL', { sessionId: tokenData.sessionId, message: 'inamopo' })
          }}
        >
          <VerifyEmailButton jwtToken={jwtToken} />
        </form>
      </div>
    )
  } catch (err) {
    if (err instanceof CustomError) redirect(`/signup?error=${err.message}`)
    return notFound()
  }
}
