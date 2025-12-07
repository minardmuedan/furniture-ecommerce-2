export type Session = {
  id: string
  createdAt: Date
  userId: string
  ipAddress: string
  userAgent: string | null
  expiresAt: Date
  user: {
    email: string
    password: string
    id: string
    username: string
    emailVerified: Date | null
    createdAt: Date
    updatedAt: Date
  }
}

export type ClientSession = { sessionId: string; user: { username: string; email: string } } | null
