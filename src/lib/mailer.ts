import 'server-only'

export const mailerSendEmailVerificationToken = async (email: string, jwtToken: string) => {
  // todo: create send email fn here ...
  console.log(`\n\n${new Date().toLocaleString()} sended to ${email} \n`)
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/signup/verify?token=${jwtToken} \n\n`)
}

export const mailerSendPasswordVerificationToken = async (email: string, jwtToken: string) => {
  // todo: create send email fn here ...
  console.log(`\n\n${new Date().toLocaleString()} sended to ${email} \n`)
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/i_have_alzheimer/change-password?token=${jwtToken} \n\n`)
}
