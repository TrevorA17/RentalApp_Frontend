import { WorkspaceShell } from "@/components/shell/WorkspaceShell";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WorkspaceShell mode="app">{children}</WorkspaceShell>;
}
