import { getVerificationTokenDb } from '@/db/utils/verifications'
import EmailVerificationChecker from '@/features/auth/signup/verification/checker'
import { getCookie } from '@/lib/headers'

export default async function SignupPage() {
  const verificationId = await getCookie('signup')
  if (verificationId) {
    const verificationTokenData = await getVerificationTokenDb(verificationId, 'email-verification')

    if (verificationTokenData && !verificationTokenData.user.emailVerified) {
      return <div>a component that renders verification of the email</div>
    }
  }

  return <EmailVerificationChecker verificationId={'somethingid'} userEmail="minard@gmail.examplecom" />
}
