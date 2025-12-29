import SignupEmailVerificationCheckerCard from '@/features/auth/signup/signup-email-verification'
import SignupCardForm from '@/features/auth/signup/signup-form'
import { getVerificationToken, isVerificationError } from '@/features/auth/lib/auth-token'
import { getCookie } from '@/lib/headers'

export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const { error } = await searchParams
  const formError = isVerificationError(error)
  try {
    const email = await getCookie('signup')
    if (!email) throw null
    const { sessionId, expiresAt } = await getVerificationToken('email', email)
    return <SignupEmailVerificationCheckerCard sessionId={sessionId} expiresAt={expiresAt} email={email} formError={formError} />
  } catch {
    return <SignupCardForm initialFormError={formError} />
  }
}
