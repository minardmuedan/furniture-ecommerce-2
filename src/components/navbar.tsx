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
import { categories } from '@/lib/categories'
import { sessionStore } from '@/lib/zustand-store/session'
import { socketStore } from '@/lib/zustand-store/socket'
import type { ClientSession } from '@/types/session'
import Link from 'next/link'
import { useStore } from 'zustand'
import PlantLogo from './plant-logo'
import { ButtonLink } from './ui/button'

export default function Navbar() {
  const isInitializing = useStore(sessionStore, (s) => s.isInitializing)
  const isPending = useStore(sessionStore, (s) => s.isPending)
  const session = useStore(sessionStore, (s) => s.session)

  return (
    <header className="flex h-14 items-center justify-between border-b px-5">
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
    </header>
  )
}

function NavMenu() {
  const navMenuList = [
    { title: 'home', href: '/' },
    { title: 'categories', sublinks: categories },
    { title: 'products', href: '/products' },
    { title: 'about', href: '/' },
    { title: 'contact us', href: '/' },
  ] as const

  return (
    <NavigationMenu className="text-muted-foreground">
      {navMenuList.map((menuList) => (
        <NavigationMenuList key={menuList.title}>
          <NavigationMenuItem>
            {'sublinks' in menuList ? (
              <>
                <NavigationMenuTrigger className="text-muted-foreground">categories </NavigationMenuTrigger>
                <NavigationMenuContent className="grid min-w-md grid-cols-2">
                  {Object.entries(menuList.sublinks).map(([category, categoryData]) => (
                    <NavigationMenuLink key={category} asChild>
                      <Link href={`/${category}`}>
                        <div>
                          <div className="font-normal">{categoryData.title}</div>
                          <ul className="text-muted-foreground">
                            {Object.entries(categoryData.subcategories).map(([subcategory, subcategoryData]) => (
                              <li key={subcategory}>{subcategoryData.title}</li>
                            ))}
                          </ul>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
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
