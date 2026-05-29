import { PublicMarketplaceShell } from "@/components/shell/PublicMarketplaceShell";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicMarketplaceShell>{children}</PublicMarketplaceShell>;
}
