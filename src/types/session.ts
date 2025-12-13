export type Session = { sessionId: string; user: { id: string; username: string; email: string; isAdmin: boolean | null } }
export type ClientSession = { sessionId: string; user: { username: string; email: string } } | null
