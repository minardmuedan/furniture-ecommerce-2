import EmailVerificationCheckerCard from '@/features/auth/email-verification/checker'
import { getVerificationToken } from '@/features/auth/helpers/token'
import SignupCardForm from '@/features/auth/signup/form'
import { getCookie } from '@/lib/headers'

export default async function SignupPage() {
  try {
    const tokenId = await getCookie('signup')
    if (!tokenId) throw null

    const tokenData = await getVerificationToken('email', tokenId)
    return (
      <EmailVerificationCheckerCard sessionId={tokenData.sessionId} expiresAt={tokenData.expiresAt} email={tokenData.user.email} />
    )
  } catch {
    return <SignupCardForm />
  }
}
