import ChangePasswordForm from '@/features/auth/forgot-password/change-password-form'
import { getVerificationTokenByJwtToken } from '@/lib/auth-token'
import { CustomError } from '@/lib/server-action'
import { notFound, redirect } from 'next/navigation'

export default async function CreatePasswordPage({ searchParams }: PageProps<'/i_have_alzheimer/change-password'>) {
  try {
    const { token: jwtToken } = await searchParams
    if (typeof jwtToken !== 'string') throw ''
    const { email, expiresAt } = await getVerificationTokenByJwtToken('password', jwtToken)
    return <ChangePasswordForm jwtToken={jwtToken} email={email} expiresAt={expiresAt} />
  } catch (err) {
    if (err instanceof CustomError) redirect(`/i_have_alzheimer?error=${err.type}`)
    notFound()
  }
}
