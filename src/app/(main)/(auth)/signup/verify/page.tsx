import PlantLogo from '@/components/plant-logo'
import VerifyEmailFormCard from '@/features/auth/signup/verify-email-form'
import { getVerificationTokenByJwtToken } from '@/features/auth/lib/auth-token'
import { getCookie } from '@/lib/headers'
import { CustomError } from '@/lib/server-actions/server-action'
import { SESSION_COOKIE_KEY } from '@/lib/session'
import { notFound, redirect } from 'next/navigation'

export default async function VerifyEmailPage(props: PageProps<'/signup/verify'>) {
  try {
    const { token: jwtToken } = await props.searchParams
    if (typeof jwtToken !== 'string') notFound()

    const { email, sessionId, expiresAt } = await getVerificationTokenByJwtToken('email', jwtToken)
    const isSameDevice = (await getCookie(SESSION_COOKIE_KEY)) === sessionId

    return (
      <>
        <PlantLogo width={48} height={48} />
        <VerifyEmailFormCard jwtToken={jwtToken} expiresAt={expiresAt} email={email} autoSigned={isSameDevice} />
      </>
    )
  } catch (err) {
    if (err instanceof CustomError) redirect(`/signup?error=${err.type}`)
    return notFound()
  }
}
