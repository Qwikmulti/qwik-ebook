import type { Metadata } from "next";
import { AdminSessionProvider } from "@/components/admin/SessionProvider";

export const metadata: Metadata = {
  title: "Admin — UK Study Guide",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>;
}
