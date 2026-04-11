import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppHeader } from "@/components/shell/AppHeader";
import { AuthGuard } from "@/features/auth/AuthGuard";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <AppHeader />
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
          <Paper sx={{ p: 3, minWidth: { lg: 240 }, width: "100%" }}>
            <Stack spacing={1.25}>
              <Chip label="Authenticated Area" color="secondary" sx={{ width: "fit-content" }} />
              <Typography variant="h6">Module workspace</Typography>
              <Typography color="text.secondary">
                This shell is intentionally lean. It now supports auth and will absorb listings, profile, and inquiry navigation as those modules become real.
              </Typography>
            </Stack>
          </Paper>
          <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
        </Stack>
      </Box>
    </AuthGuard>
  );
}
