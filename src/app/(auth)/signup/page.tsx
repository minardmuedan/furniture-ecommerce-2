import EmailVerificationCheckerCard from '@/features/auth/email-verification/checker'
import SignupCardForm from '@/features/auth/signup/signup-form'
import { getVerificationToken } from '@/lib/auth-token'
import { getCookie } from '@/lib/headers'

const acceptedErrorMessages = ['Verification token not found!', 'Verification token not matched!', 'Verification token is expired!']

export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const { error } = await searchParams
  const initialFormError = typeof error === 'string' && acceptedErrorMessages.includes(error) ? error : undefined

  try {
    const email = await getCookie('signup')
    if (!email) throw null
    const { sessionId, expiresAt } = await getVerificationToken('email', email)
    return <EmailVerificationCheckerCard sessionId={sessionId} expiresAt={expiresAt} email={email} />
  } catch {
    return <SignupCardForm initialFormError={error ? initialFormError : undefined} />
  }
}
