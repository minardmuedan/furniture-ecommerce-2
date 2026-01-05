'use client'

import PlantLogo from '@/components/plant-logo'
import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormError from '@/components/ui/error'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { setRatelimit, useServerAction } from '@/hooks/server-action'
import { typedObjectEntries } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { signupSchema } from '../lib/schema'
import { signupAction } from './actions'

export default function SignupCardForm({ initialFormError }: { initialFormError?: string }) {
  const [formError, setFormError] = useState(initialFormError)

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const action = useServerAction(signupAction, {
    rateLimitKey: 'signup',
    onFieldError: (fields) => {
      typedObjectEntries(fields).map(([key, error]) => form.setError(key, { message: error?.[0] }, { shouldFocus: true }))
    },
    onError: (err) => setFormError(err.message),
    onSuccess: () => setRatelimit('resend-email-verification', 30),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(undefined)
    form.handleSubmit(action.execute)(e)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-end gap-2">
          <PlantLogo />
          Create an acccount
        </CardTitle>
        <CardDescription>Fill up the required fields to continue</CardDescription>
        <CardAction>
          <ButtonLink href="/login" variant="link" className="group">
            Login
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </ButtonLink>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit} className="space-y-6">
          <FormError error={formError} />

          {signupFormFields.map((formField) => (
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
        <Button type="submit" disabled={!action.isHydrated || action.isPending || action.rateLimiter.isLimit} form="signup-form" className="w-full">
          {action.rateLimiter.isLimit ? `Continue after ${action.rateLimiter.secondsLeft} second/s` : 'Continue'}
        </Button>
      </CardFooter>
    </Card>
  )
}

const signupFormFields = [
  { name: 'username', title: 'Username', inputProps: { type: 'text', placeholder: 'username123', autoComplete: 'username' } },
  { name: 'email', title: 'Email', inputProps: { type: 'email', placeholder: 'minard@example.com' } },
  { name: 'password', title: 'Password', inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' } },
  { name: 'confirmPassword', title: 'Confirm Password', inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' } },
] as const
