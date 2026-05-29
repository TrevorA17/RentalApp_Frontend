import { DashboardShell } from "@/components/shell/DashboardShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell mode="admin">{children}</DashboardShell>;
}
