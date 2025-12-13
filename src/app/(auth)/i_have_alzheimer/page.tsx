import PlantLogo from '@/components/plant-logo'
import ForgotPasswordFormCard from '@/features/auth/forgot-password/forgot-password-form'
import ForgotPasswordVerificationChecker from '@/features/auth/forgot-password/verification-checker'
import { verificationError, getVerificationToken } from '@/lib/auth-token'
import { getCookie } from '@/lib/headers'

type AllowedErrorType = keyof typeof verificationError
const allowedErrorTypes: AllowedErrorType[] = ['not_found', 'not_matched', 'expired']

export default async function ForgotPasswordPage({ searchParams }: PageProps<'/i_have_alzheimer'>) {
  const { error } = await searchParams
  const initialFormError =
    typeof error === 'string' && allowedErrorTypes.includes(error as AllowedErrorType) ? verificationError[error as AllowedErrorType] : undefined

  try {
    const email = await getCookie('forgot-password')
    if (!email) throw null

    const { expiresAt } = await getVerificationToken('password', email)
    return <ForgotPasswordVerificationChecker email={email} expiresAt={expiresAt} />
  } catch {
    return (
      <>
        <PlantLogo width={48} height={48} />
        <ForgotPasswordFormCard initialFormError={initialFormError} />
      </>
    )
  }
}
