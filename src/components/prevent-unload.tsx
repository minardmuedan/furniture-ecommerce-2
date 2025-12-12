'use client'

import { useEffect } from 'react'
import { create } from 'zustand'

type PreventUnloadStore = { canUnload: boolean; setCanUnload: (value: boolean) => void }

export const usePreventUnload = create<PreventUnloadStore>((set) => ({
  canUnload: true,
  setCanUnload: (value) => set({ canUnload: value }),
}))

export default function PreventUnload() {
  const { canUnload } = usePreventUnload()

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (canUnload) return

      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [canUnload])

  return null
}
