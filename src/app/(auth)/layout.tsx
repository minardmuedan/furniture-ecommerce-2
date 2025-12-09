export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return <div className="min-h-svhminusnav flex items-center justify-center py-5">{children}</div>
}
