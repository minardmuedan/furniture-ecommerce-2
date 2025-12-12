'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export const usePreventNavigation = (onNavigationAttempt?: () => void) => {
  const pathname = usePathname()
  const pendingNavigation = useRef<(() => void) | null>(null)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (!link?.href) return

      try {
        const url = new URL(link.href)
        if (url.pathname !== pathname) {
          e.preventDefault()
          e.stopPropagation()

          if (onNavigationAttempt) {
            pendingNavigation.current = () => {
              window.location.href = link.href
            }
            onNavigationAttempt()
          }
        }
      } catch {}
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleClick, true)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleClick, true)
    }
  }, [pathname, onNavigationAttempt])

  const confirmNavigation = () => {
    if (pendingNavigation.current) {
      pendingNavigation.current()
      pendingNavigation.current = null
    }
  }

  const cancelNavigation = () => {
    pendingNavigation.current = null
  }

  return { confirmNavigation, cancelNavigation }
}
