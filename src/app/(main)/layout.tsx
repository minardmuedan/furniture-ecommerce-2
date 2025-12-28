import InitializeSessionSocket from '@/components/initialize-session'
import Navbar from '@/components/navbar'
import UnloadPreventer from '@/components/unload-preventer'
import { SWRConfigProvider } from './providers'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfigProvider>
      <UnloadPreventer />
      <InitializeSessionSocket />

      <Navbar />

      <main className="mx-auto 2xl:max-w-[1400px]">{children}</main>
    </SWRConfigProvider>
  )
}
