import InitializeSessionSocket from '@/components/initialize-session'
import Navbar from '@/components/navbar'
import UnloadPreventer from '@/components/unload-preventer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnloadPreventer />
      <InitializeSessionSocket />
      <Navbar />

      {children}
    </>
  )
}
