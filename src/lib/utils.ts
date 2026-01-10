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

export const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')

export const getContrastColor = (hexColor: string) => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return Number((brightness / 255).toFixed(2))
}

export const addOpacityToHex = (hex: string, opacity: number) => {
  const cleanHex = hex.replace('#', '')
  const alphaDecimal = Math.round(opacity * 255)
  let alphaHex = alphaDecimal.toString(16)
  if (alphaHex.length === 1) alphaHex = `0${alphaHex}`
  return `#${cleanHex}${alphaHex.toUpperCase()}`
}
