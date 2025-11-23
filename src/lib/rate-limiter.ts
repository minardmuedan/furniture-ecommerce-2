import 'server-only'

type RecordData = { attempt: number; lastUsed: number }
const records = new Map<string, RecordData>()

export const createMemoryRateLimiter = (maxAttempt: number, { refill }: { refill: { attempt: number; perSeconds: number } }) => {
  const refillPerMs = refill.perSeconds * 1000

  return (id: string) => {
    const now = Date.now()
    const record: RecordData = records.get(id) ?? { attempt: maxAttempt, lastUsed: now }

    const elapsed = Math.floor((now - record.lastUsed) / refillPerMs)
    if (elapsed > 0) {
      const newRecordAttempts = elapsed * refill.attempt + record.attempt
      record.attempt = Math.min(maxAttempt, newRecordAttempts)
    }

    const retryAt = record.lastUsed + refillPerMs
    if (record.attempt <= 0) return { exceed: true, retryAt } as const

    record.attempt -= 1
    record.lastUsed = now
    records.set(id, record)

    return { exceed: false, retryAt, ...record } as const
  }
}

// todo:  add cleanup
