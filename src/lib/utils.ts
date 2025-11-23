import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const typedObjectKeys = <TKey extends string>(o: Record<TKey, unknown>) => Object.keys(o) as TKey[]
export const typedObjectValues = <TValues>(o: Record<string, TValues>) => Object.values(o) as TValues[]
export const typedObjectEntries = <TKey extends string, TValues>(o: Partial<Record<TKey, TValues>>) =>
  Object.entries(o) as [TKey, TValues][]
