import { getVerificationTokenDb } from '@/db/utils/verifications'
import SignupCardForm from '@/features/auth/signup/form'
import SignupVerificationCardForm from '@/features/auth/signup/verification/form'
import { getCookie } from '@/lib/headers'

export default async function SignupPage() {
  const signupId = await getCookie('signup')
  if (signupId) {
    const verificationTokenData = await getVerificationTokenDb(signupId, 'email-verification')

    if (verificationTokenData && !verificationTokenData.user.emailVerified) {
      return <div>a component that renders verification of the email</div>
    }
  }

  return <SignupVerificationCardForm />
}
