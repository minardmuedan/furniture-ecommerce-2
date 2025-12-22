import 'dotenv/config'
import { DefaultLogger, type LogWriter } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { appendFileSync } from 'fs'
import * as schema from './schema'

class MyLogWriter implements LogWriter {
  write(message: string) {
    console.log(`\nDATABASE: ${message}\n`)
    appendFileSync('queries.log', `${message}\n\n`)
  }
}

const logger = new DefaultLogger({ writer: new MyLogWriter() })
export const db = drizzle(process.env.DATABASE_URL!, { schema, logger })
