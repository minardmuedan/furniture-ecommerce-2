'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormError from '@/components/ui/error'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useServerAction } from '@/hooks/server-action'
import { typedObjectEntries } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { signupAction } from './action'
import { signupSchema } from './schema'

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

export default function SignupCardForm() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const action = useServerAction(signupAction, {
    rateLimitKey: 'signup',
    onError: (err) => form.setError('root', { message: err.message }),
    onFieldError: (fields) => typedObjectEntries(fields).map(([key, error]) => form.setError(key, { message: error[0] })),
    onSuccess: () => localStorage.setItem('resend-email-verification', (Date.now() + 30_000).toString()),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an acccount </CardTitle>
        <CardDescription>Fill up the required fields to continue</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="signup-form" onSubmit={form.handleSubmit(action.execute)} className="space-y-6">
          <FormError error={form.formState.errors.root?.message} />

          {formFields.map((formField) => (
            <FieldGroup key={formField.name}>
              <Controller
                disabled={action.rateLimiter.isLimit}
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
        <Button
          type="submit"
          disabled={!form.formState.isReady || action.isPending || action.rateLimiter.isLimit}
          form="signup-form"
          className="z-10 w-full"
        >
          {action.rateLimiter.isLimit ? `Continue after ${action.rateLimiter.remainingSeconds} second/s` : 'Continue'}
        </Button>
      </CardFooter>
    </Card>
  )
}
