import SignupCardForm from '@/features/auth/signup/form'
import RejectSignupVerificationButton from '@/features/auth/signup/verification/reject-button'
import ResendEmailVerificationButton from '@/features/auth/signup/verification/resend-button'
import { getCookie } from '@/lib/headers'
import { redis } from '@/lib/redis'
import { Mailbox } from 'lucide-react'

export default async function SignupPage() {
  const verificationId = await getCookie('signup')
  if (verificationId) {
    const verificationData = await redis.get(`verification:email:${verificationId}`)

    if (verificationData) {
      return (
        <div>
          <div className="mb-8 text-center">
            <Mailbox className="mx-auto size-20" />
            <h1 className="mb-1 text-xl font-semibold">Please check your email inbox</h1>
            <div className="text-muted-foreground text-sm font-medium">{verificationData.user.email}</div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <ResendEmailVerificationButton />
            <RejectSignupVerificationButton />
          </div>
        </div>
      )
    }
  }

  return <SignupCardForm />
}
