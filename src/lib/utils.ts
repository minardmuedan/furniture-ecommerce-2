import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSecureRandomString(length: 24 | 28 = 24): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789'
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)

  let id = ''
  for (let i = 0; i < bytes.length; i++) {
    id += alphabet[bytes[i] >> 3]
  }
  return id
}

export const typedObjectKeys = <TKey extends string>(o: Record<TKey, unknown>) => Object.keys(o) as TKey[]
// export const typedObjectValues = <TValues>(o: Record<string, TValues>) => Object.values(o) as TValues[]
export const typedObjectEntries = <T extends Record<string, unknown>>(o: T) => Object.entries(o) as Array<[keyof T, T[keyof T]]>
