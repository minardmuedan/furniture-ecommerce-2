'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormError from '@/components/ui/error'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { setRatelimit, useServerAction } from '@/hooks/server-action'
import { typedObjectEntries } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { signupSchema } from '../schema'
import { signupAction } from './action'
import { signupFormFields } from './form-fields'

export default function SignupCardForm({ initialFormError }: { initialFormError?: string }) {
  const [formError, setFormError] = useState(initialFormError)

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  })

  const action = useServerAction(signupAction, {
    rateLimitKey: 'signup',
    onFieldError: (fields) => {
      typedObjectEntries(fields).map(([key, error]) => form.setError(key, { message: error[0] }, { shouldFocus: true }))
    },
    onError: (err) => setFormError(err.message),
    onSuccess: () => setRatelimit('resend-email-verification', 30),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an acccount </CardTitle>
        <CardDescription>Fill up the required fields to continue</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signup-form"
          onSubmit={() => {
            setFormError(undefined)
            form.handleSubmit(() => action.execute)
          }}
          className="space-y-6"
        >
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
          disabled={!action.isHydrated || action.isPending || action.rateLimiter.isLimit}
          form="signup-form"
          className="z-10 w-full"
        >
          {action.rateLimiter.isLimit ? `Continue after ${action.rateLimiter.secondsLeft} second/s` : 'Continue'}
        </Button>
      </CardFooter>
    </Card>
  )
}
