// This layout wraps all /admin/dashboard/* pages
// Authentication is handled by middleware.ts
export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
