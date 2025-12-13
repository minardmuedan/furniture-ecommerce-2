'use client'

import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormError from '@/components/ui/error'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { setRatelimit, useServerAction } from '@/hooks/server-action'
import { typedObjectEntries } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { forgotPasswordSchema } from '../schema'
import { forgotPasswordAction } from './actions'

export default function ForgotPasswordFormCard({ initialFormError }: { initialFormError?: string }) {
  const [formError, setFormError] = useState(initialFormError)
  const form = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } })

  const action = useServerAction(forgotPasswordAction, {
    rateLimitKey: 'forgot-password',
    onFieldError: (fields) => {
      typedObjectEntries(fields).map(([key, error]) => form.setError(key, { message: error[0] }, { shouldFocus: true }))
    },
    onError: (err) => setFormError(err.message),
    onSuccess: () => setRatelimit('rresend-password-verification', 30),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(undefined)
    form.handleSubmit(action.execute)(e)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password?</CardTitle>
        <CardDescription>Enter your email to recieve a link</CardDescription>
        <CardAction>
          <ButtonLink href="/login" variant="link" className="group">
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Login
          </ButtonLink>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-6">
          <FormError error={formError} />

          <FieldGroup>
            <Controller
              disabled={action.rateLimiter.isLimit}
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input {...field} id="email" aria-invalid={fieldState.invalid} type="email" placeholder="minard@example.com" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} className="animate-in slide-in-from-left-2 ease-in" />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="relative flex-col gap-2">
        <Button
          type="submit"
          disabled={!action.isHydrated || action.isPending || action.rateLimiter.isLimit}
          form="forgot-password-form"
          className="w-full"
        >
          {action.rateLimiter.isLimit ? `Continue after ${action.rateLimiter.secondsLeft} second/s` : 'Continue'}
        </Button>
      </CardFooter>
    </Card>
  )
}
