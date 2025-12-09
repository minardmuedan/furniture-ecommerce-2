import { db } from '@/db'
import { sessionsTable, usersTable } from '@/db/schema'

async function deleteData() {
  await db.delete(sessionsTable)
  await db.delete(usersTable)
}

deleteData().catch(console.error)
