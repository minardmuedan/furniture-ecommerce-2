import z from 'zod'

export const signupSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z.email({ error: 'Invalid email address' }),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], error: 'Password did not match' })

export const verificationTokenSchema = z.object({ jwtToken: z.string() })

export type SignupSchema = z.infer<typeof signupSchema>
