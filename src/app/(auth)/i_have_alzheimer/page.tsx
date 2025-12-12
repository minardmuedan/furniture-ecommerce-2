import PlantLogo from '@/components/plant-logo'
import ForgotPasswordFormCard from '@/features/auth/forgot-password/forgot-password-form'
import { getVerificationToken } from '@/lib/auth-token'
import { getCookie } from '@/lib/headers'

export default async function ForgotPasswordPage() {
  try {
    const email = await getCookie('forgot-password')
    if (!email) throw null
    const { expiresAt } = await getVerificationToken('password', email)
    return <p>password verification waiting page {expiresAt}</p>
  } catch {
    return (
      <>
        <PlantLogo width={48} height={48} />
        <ForgotPasswordFormCard />
      </>
    )
  }
}
