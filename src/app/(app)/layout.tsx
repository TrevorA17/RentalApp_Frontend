import { DashboardShell } from "@/components/shell/DashboardShell";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell mode="app">{children}</DashboardShell>;
}
