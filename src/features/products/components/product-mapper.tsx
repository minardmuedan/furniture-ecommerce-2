export default function ProductMapper({ children }: { children: React.ReactNode }) {
  return <ul className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-[repeat(auto-fit,200px)] sm:gap-12 lg:gap-16">{children}</ul>
}
