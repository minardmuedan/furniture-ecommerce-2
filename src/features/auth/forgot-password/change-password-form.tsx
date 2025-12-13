'use client'

import PlantLogo from '@/components/plant-logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormError from '@/components/ui/error'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useServerAction } from '@/hooks/server-action'
import { typedObjectEntries } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { changePasswordSchema } from '../schema'
import { changeUserPasswordAction } from './actions'
import { useEffect } from 'react'
import { useCountdown } from '@/hooks/countdown'
import { Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordForm({ jwtToken, email, expiresAt }: { jwtToken: string; email: string; expiresAt: number }) {
  const router = useRouter()
  const { secondsLeft, setTargetDate } = useCountdown(expiresAt)

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const action = useServerAction(changeUserPasswordAction, {
    rateLimitKey: 'change-password',
    onFieldError: (fields) => {
      typedObjectEntries(fields).map(([key, error]) => {
        if (key !== 'jwtToken') form.setError(key, { message: error[0] }, { shouldFocus: true })
      })
    },
    onError: (err, router) => {
      form.setError('root', { message: err.message })
      router.refresh()
    },
    onSuccess: ({ message }, router) => {
      toast.success(message)
      router.replace('/login')
    },
  })

  useEffect(() => {
    setTargetDate(expiresAt)

    const timeoutId = setTimeout(() => {
      router.refresh()
    }, expiresAt - Date.now())

    return () => clearTimeout(timeoutId)
  }, [expiresAt])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-end gap-2">
          <PlantLogo />
          Create your new password
        </CardTitle>
        <CardDescription>
          Change password for {email} <Clock className="inline size-4" />{' '}
          {secondsLeft > 60 ? `${Math.ceil(secondsLeft / 60)} minutes` : `${secondsLeft} seconds`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="change-password-form" onSubmit={form.handleSubmit((values) => action.execute({ jwtToken, ...values }))} className="space-y-6">
          <FormError error={form.formState.errors.root?.message} />

          {changePasswordFormFields.map((formField) => (
            <FieldGroup key={formField.name}>
              <Controller
                disabled={action.rateLimiter.isLimit}
                name={formField.name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={formField.name}>{formField.title}</FieldLabel>
                    <Input {...field} id={formField.name} aria-invalid={fieldState.invalid} {...formField.inputProps} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="animate-in slide-in-from-left-2 ease-in" />}
                  </Field>
                )}
              />
            </FieldGroup>
          ))}
        </form>
      </CardContent>

      <CardFooter className="relative flex-col">
        <Button
          type="submit"
          disabled={!action.isHydrated || action.isPending || action.rateLimiter.isLimit}
          form="change-password-form"
          className="w-full"
        >
          {action.rateLimiter.isLimit ? `Change Password after ${action.rateLimiter.secondsLeft} second/s` : 'Change Password'}
        </Button>
      </CardFooter>
    </Card>
  )
}

const changePasswordFormFields = [
  { name: 'password', title: 'New Password', inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' } },
  { name: 'confirmPassword', title: 'Confirm Password', inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' } },
] as const
