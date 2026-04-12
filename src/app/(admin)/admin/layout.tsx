import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { AppHeader } from "@/components/shell/AppHeader";
import { WorkspaceSidebar } from "@/components/shell/WorkspaceSidebar";
import { AuthGuard } from "@/features/auth/AuthGuard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AppHeader />
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
          <WorkspaceSidebar mode="admin" />
          <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
        </Stack>
      </Box>
    </AuthGuard>
  );
}
