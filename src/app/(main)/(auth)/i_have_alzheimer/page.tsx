import PlantLogo from '@/components/plant-logo'
import ForgotPasswordFormCard from '@/features/auth/forgot-password/forgot-password-form'
import ForgotPasswordVerificationCheckerCard from '@/features/auth/forgot-password/forgot-password-verification'
import { getVerificationToken, isVerificationError } from '@/features/auth/lib/auth-token'
import { getCookie } from '@/lib/headers'

export default async function ForgotPasswordPage({ searchParams }: PageProps<'/i_have_alzheimer'>) {
  const { error } = await searchParams
  const formError = isVerificationError(error)
  try {
    const email = await getCookie('forgot-password')
    if (!email) throw null

    const { expiresAt } = await getVerificationToken('password', email)
    return <ForgotPasswordVerificationCheckerCard email={email} expiresAt={expiresAt} formError={formError} />
  } catch {
    return (
      <>
        <PlantLogo width={48} height={48} />
        <ForgotPasswordFormCard initialFormError={formError} />
      </>
    )
  }
}
