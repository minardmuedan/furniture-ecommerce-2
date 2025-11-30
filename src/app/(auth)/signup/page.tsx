import { getVerificationTokenDb } from '@/db/utils/verifications'
import SignupCardForm from '@/features/auth/signup/form'
import EmailVerificationChecker from '@/features/auth/signup/verification/checker'
import { getCookie } from '@/lib/headers'

export default async function SignupPage() {
  const tokenId = await getCookie('signup')
  if (tokenId) {
    const verificationTokenData = await getVerificationTokenDb(tokenId, 'email-verification')

    if (verificationTokenData && Date.now() < verificationTokenData.expiresAt.getTime() && !verificationTokenData.user.emailVerified) {
      return <EmailVerificationChecker verificationId={verificationTokenData.id} userEmail={verificationTokenData.user.email} />
    }
  }

  return <SignupCardForm />
}
