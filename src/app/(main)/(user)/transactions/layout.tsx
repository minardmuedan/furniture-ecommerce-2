import { Section, sectionTriggerStyle } from '@/components/sections'

export default function UserTransactionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Section className="flex items-start gap-10 py-3">
      <aside className="sticky top-17 hidden w-52 border md:block">
        <h2 className="text-muted-foreground mb-6">Transactions</h2>
        <nav>cart</nav>
      </aside>

      <main className="flex-1">{children}</main>
    </Section>
  )
}
