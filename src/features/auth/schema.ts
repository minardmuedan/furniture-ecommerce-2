import z from 'zod'

export const emailSchema = z.email('Enter a valid email address')

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(64, 'Password must be at most 64 characters')
  .regex(/[a-zA-Z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number')

export const signupSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(15, 'Must be at most 15 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Password do not match' })

export type Signup = z.infer<typeof signupSchema>
