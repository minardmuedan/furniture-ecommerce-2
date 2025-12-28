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

export const typedObjectEntries = <T extends Record<string, unknown>>(o: T) => Object.entries(o) as Array<[keyof T, T[keyof T]]>

export const formatProductPrice = (price: string | number) => Number(price).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })

export const getContrastColor = (hexColor: string) => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
