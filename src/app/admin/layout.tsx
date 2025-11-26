// Layout for admin routes - authentication is handled by middleware
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

