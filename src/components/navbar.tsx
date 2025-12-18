'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import LogoutButton from '@/features/auth/logout/logout-button'
import { categories, getCategoryTitle } from '@/lib/categories'
import { cn } from '@/lib/utils'
import { sessionStore } from '@/lib/zustand-store/session'
import { socketStore } from '@/lib/zustand-store/socket'
import type { ClientSession } from '@/types/session'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import PlantLogo from './plant-logo'
import { ButtonLink } from './ui/button'

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0)
  const isInitializing = useStore(sessionStore, (s) => s.isInitializing)
  const isPending = useStore(sessionStore, (s) => s.isPending)
  const session = useStore(sessionStore, (s) => s.session)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return

      const currentScrollY = window.scrollY
      if (currentScrollY < 200) {
        window.requestAnimationFrame(() => {
          setScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      } else if (currentScrollY !== 200) setScrollY(200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const opacity = Math.min(scrollY / 200, 1)

  return (
    <header
      style={{
        backgroundColor: `color-mix(in oklab, var(--background) ${opacity * 100}%, transparent)`,
        borderColor: `color-mix(in oklab, var(--border) ${opacity * 100}%, transparent)`,
      }}
      className="sticky top-0 z-40 h-14 border-b px-5 transition-colors"
    >
      <div className="mx-auto flex h-full items-center justify-between 2xl:max-w-[1400px]">
        <Link href="/">
          <PlantLogo /> <span className="sr-only">home</span>
        </Link>

        <NavMenu />

        {isInitializing ? (
          <p>initializing session...</p>
        ) : (
          <div className={`${isPending ? 'animate-pulse opacity-75' : 'opacity-100'} flex items-center gap-1 transition-opacity`}>
            {session ? (
              <Usernav session={session} />
            ) : (
              <>
                <ButtonLink href="/signup" variant="link">
                  Signup
                </ButtonLink>
                <ButtonLink href="/login">Login</ButtonLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function NavMenu() {
  const pathname = usePathname()

  const navMenuList = [
    { title: 'home', href: '/' },
    { title: 'categories', sublinks: categories },
    { title: 'products', href: '/products' },
    { title: 'explore', href: '/explore' },
    { title: 'about', href: '/' },
  ] as const

  const isActive = (path: string) => pathname === path
  return (
    <NavigationMenu className="text-muted-foreground hidden md:flex">
      {navMenuList.map((menuList) => (
        <NavigationMenuList key={menuList.title}>
          <NavigationMenuItem>
            {'sublinks' in menuList ? (
              <>
                <NavigationMenuTrigger
                  className={
                    Object.keys(categories).some((category) => pathname.startsWith(`/${category}`))
                      ? 'text-foreground font-calstavier text-lg underline'
                      : ''
                  }
                >
                  categories
                </NavigationMenuTrigger>
                <NavigationMenuContent className="grid min-w-md grid-cols-2">
                  {Object.entries(menuList.sublinks).map(([category, categoryData]) => (
                    <NavigationMenuLink key={category} asChild className={pathname.startsWith(`/${category}`) ? 'bg-accent' : ''}>
                      <Link href={`/${category}`}>
                        <div>
                          <div className="flex items-center gap-2 font-normal">
                            <span>{getCategoryTitle(category)}</span>
                            {isActive(`/${category}`) && <PlantLogo className="size-3" />}
                          </div>

                          <ul className="text-muted-foreground">
                            {Object.keys(categoryData.subcategories).map((subcategory) => (
                              <li key={subcategory} className="flex items-center gap-2">
                                <span>{getCategoryTitle(subcategory)}</span>
                                {isActive(`/${category}/${subcategory}`) && <PlantLogo className="size-3" />}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                asChild
                className={cn(
                  navigationMenuTriggerStyle(),
                  'hover:bg-background/0',
                  isActive(menuList.href) ? 'text-foreground font-calstavier text-base underline' : '',
                )}
              >
                <Link href={menuList.href}>{menuList.title}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      ))}
    </NavigationMenu>
  )
}

function Usernav({ session }: { session: NonNullable<ClientSession> }) {
  const isConnected = useStore(socketStore, (s) => s.isConnected)

  return (
    <div className="flex items-center gap-2">
      <div className={`${isConnected ? 'bg-green-300' : 'animate-pulse bg-yellow-200'} size-2 rounded-full`}>
        <span className="sr-only">connection indicator</span>
      </div>
      <span>hello, {session.user.username}</span>
      <LogoutButton />
    </div>
  )
}
