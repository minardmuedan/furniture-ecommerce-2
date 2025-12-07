export const signupFormFields = [
  { name: 'username', title: 'Username', inputProps: { type: 'text', placeholder: 'username123', autoComplete: 'username' } },
  { name: 'email', title: 'Email', inputProps: { type: 'email', placeholder: 'minard@example.com' } },
  { name: 'password', title: 'Password', inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' } },
  {
    name: 'confirmPassword',
    title: 'Confirm Password',
    inputProps: { type: 'password', placeholder: '********', autoComplete: 'off' },
  },
] as const
