import { WorkspaceShell } from "@/components/shell/WorkspaceShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WorkspaceShell mode="admin">{children}</WorkspaceShell>;
}
