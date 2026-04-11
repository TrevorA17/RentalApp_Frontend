import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppHeader } from "@/components/shell/AppHeader";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
          <Paper sx={{ p: 3, minWidth: { lg: 240 }, width: "100%" }}>
            <Typography variant="overline" color="secondary.main" fontWeight={800}>
              App Shell
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Module workspace
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5 }}>
              Role-aware navigation lands here after auth is implemented.
            </Typography>
          </Paper>
          <Box sx={{ flex: 1, width: "100%" }}>{children}</Box>
        </Stack>
      </Box>
    </>
  );
}
