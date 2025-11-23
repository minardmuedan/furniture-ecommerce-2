'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormError from '@/components/ui/error'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useIsHydrated } from '@/hooks/is-hydrated'
import { useRateLimiter } from '@/hooks/rate-limit'
import { typedObjectEntries } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { signupAction } from './action'
import { signupSchema, type SignupSchema } from './schema'

export default function SignupCardForm() {
  const isHydrated = useIsHydrated()
  const rateLimiter = useRateLimiter('signup')

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const formFields = [
    { name: 'username', title: 'Username', inputProps: { type: 'text', placeholder: 'username123', autoComplete: 'username' } },
    { name: 'email', title: 'Email', inputProps: { type: 'email', placeholder: 'minard@example.com' } },
    { name: 'password', title: 'Password', inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' } },
    {
      name: 'confirmPassword',
      title: 'Confirm Password',
      inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' },
    },
  ] as const

  async function onSubmit(data: SignupSchema) {
    const action = await signupAction(data)
    rateLimiter.watchAction(action)

    if (!action.success) {
      if (action.type === 'server_error') form.setError('root', { message: action.message })
      if (action.type === 'invalid_inputs')
        typedObjectEntries(action.fieldErrors).map(([key, error]) => form.setError(key, { message: error[0] }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an acccount </CardTitle>
        <CardDescription>Fill up the required fields to continue</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormError error={form.formState.errors.root?.message} />

          {formFields.map((formField) => (
            <FieldGroup key={formField.name}>
              <Controller
                disabled={rateLimiter.disabler}
                name={formField.name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={formField.name}>{formField.title}</FieldLabel>
                    <Input {...field} id={formField.name} aria-invalid={fieldState.invalid} {...formField.inputProps} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="animate-in slide-in-from-left-2 ease-in" />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          ))}
        </form>
      </CardContent>
      <CardFooter className="relative flex-col">
        <Button type="submit" disabled={!isHydrated || rateLimiter.disabler} form="signup-form" className="z-10 w-full">
          {rateLimiter.disabler ? `Continue after ${rateLimiter.remainingSeconds} second/s` : 'Continue'}
        </Button>
      </CardFooter>
    </Card>
  )
}
