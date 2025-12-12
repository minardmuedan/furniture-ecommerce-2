'use client'

import { Button, ButtonLink } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormError from '@/components/ui/error'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useServerAction } from '@/hooks/server-action'
import { typedObjectEntries } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { loginSchema } from '../schema'
import { loginAction } from './login-action'
import { ArrowLeft } from 'lucide-react'
import { sessionStore } from '@/lib/zustand-store/session'
import { socketStore } from '@/lib/zustand-store/socket'
import { toast } from 'sonner'

export default function LoginFormCard() {
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  const action = useServerAction(loginAction, {
    rateLimitKey: 'login',
    onFieldError: (fields) => {
      typedObjectEntries(fields).map(([key, error]) => form.setError(key, { message: error[0] }, { shouldFocus: true }))
    },
    onError: (err) => form.setError('root', { message: err.message }),
    onSuccess: async ({ message }, router) => {
      form.reset()
      const session = await sessionStore.getState().fetchSession()
      socketStore.getState().connectSocket(session!.sessionId, { router })
      toast.success(message)
      router.push('/')
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Complete the credentials to continue</CardDescription>
        <CardAction>
          <ButtonLink href="/signup" variant="link" className="group">
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Signup
          </ButtonLink>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(action.execute)} className="space-y-6">
          <FormError error={form.formState.errors.root?.message} />

          {loginFormFields.map((formField) => (
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

      <CardFooter className="relative flex-col gap-2">
        <Button
          type="submit"
          disabled={!action.isHydrated || action.isPending || action.rateLimiter.isLimit}
          form="login-form"
          className="w-full"
        >
          {action.rateLimiter.isLimit ? `Login after ${action.rateLimiter.secondsLeft} second/s` : 'Login'}
        </Button>
        <ButtonLink href="/i_have_alzheimer" variant="link" className="w-full">
          Fogot your password?
        </ButtonLink>
      </CardFooter>
    </Card>
  )
}

const loginFormFields = [
  { name: 'email', title: 'Email', inputProps: { type: 'email', placeholder: 'minard@example.com' } },
  { name: 'password', title: 'Password', inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' } },
] as const
