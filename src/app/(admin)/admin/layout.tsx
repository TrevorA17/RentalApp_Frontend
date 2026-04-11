import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppHeader } from "@/components/shell/AppHeader";
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
          <Paper sx={{ p: 3, minWidth: { lg: 260 }, width: "100%" }}>
            <Typography variant="overline" color="secondary.main" fontWeight={800}>
              Admin
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Moderation workspace
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              This area is protected for admin users only.
            </Typography>
          </Paper>
          <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
        </Stack>
      </Box>
    </AuthGuard>
  );
}
