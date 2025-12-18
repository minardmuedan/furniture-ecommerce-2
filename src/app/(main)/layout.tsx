import InitializeSessionSocket from '@/components/initialize-session'
import Navbar from '@/components/navbar'
import UnloadPreventer from '@/components/unload-preventer'
import { SWRConfigProvider } from './providers'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfigProvider>
      <UnloadPreventer />
      <InitializeSessionSocket />
      <Navbar />

      <main className="mx-auto 2xl:max-w-[1400px]">
        <Suspense
          fallback={
            <div className="min-h-svhminusnav grid place-items-center">
              <Spinner className="text-muted-foreground" />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </SWRConfigProvider>
  )
}
