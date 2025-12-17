export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return <div className="min-h-svhminusnav flex flex-col items-center justify-center gap-6 border-t py-6">{children}</div>
}
