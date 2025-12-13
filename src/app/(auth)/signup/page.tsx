import EmailVerificationCheckerCard from '@/features/auth/email-verification/checker'
import SignupCardForm from '@/features/auth/signup/signup-form'
import { getVerificationToken, verificationError } from '@/lib/auth-token'
import { getCookie } from '@/lib/headers'

type AllowedErrorType = keyof typeof verificationError
const allowedErrorTypes: AllowedErrorType[] = ['not_found', 'not_matched', 'expired']

export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const { error } = await searchParams

  const initialFormError =
    typeof error === 'string' && allowedErrorTypes.includes(error as AllowedErrorType) ? verificationError[error as AllowedErrorType] : undefined

  try {
    const email = await getCookie('signup')
    if (!email) throw null
    const { sessionId, expiresAt } = await getVerificationToken('email', email)
    return <EmailVerificationCheckerCard sessionId={sessionId} expiresAt={expiresAt} email={email} />
  } catch {
    return <SignupCardForm initialFormError={initialFormError} />
  }
}
