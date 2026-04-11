import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PageSection } from "@/components/shell/PageSection";

export default function HomePage() {
  return (
    <PageSection>
      <Stack spacing={3}>
        <Paper
          sx={{
            overflow: "hidden",
            p: { xs: 3, md: 6 },
            background:
              "linear-gradient(135deg, rgba(19,93,102,0.92), rgba(22,42,82,0.92))",
            color: "white",
          }}
        >
          <Stack spacing={3}>
            <Typography variant="overline" sx={{ opacity: 0.9, letterSpacing: 2 }}>
              RENTAL-FIRST DISCOVERY
            </Typography>
            <Typography variant="h1" maxWidth={780}>
              Find a better-fit rental before you waste time on bad listings.
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, opacity: 0.9 }}>
              The current frontend is intentionally module-driven. Auth is working, listings are scaffolded, and the rest of the product can now be connected without rebuilding the app shell.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button href="/listings" variant="contained" color="secondary">
                Browse Listings
              </Button>
              <Button
                href="/register"
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}
              >
                Create Account
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={1.5}>
                <Chip label="Working now" color="secondary" sx={{ width: "fit-content" }} />
                <Typography variant="h5">Auth module</Typography>
                <Typography color="text.secondary">
                  Registration, login, logout, route protection, and a role-aware dashboard are already active.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={1.5}>
                <Chip label="Scaffolded" color="primary" sx={{ width: "fit-content" }} />
                <Typography variant="h5">Listings and inquiries</Typography>
                <Typography color="text.secondary">
                  Browse, detail, favorites, inquiries, and poster flows already have route targets for upcoming modules.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={1.5}>
                <Chip label="Next" sx={{ width: "fit-content" }} />
                <Typography variant="h5">Backend auth</Typography>
                <Typography color="text.secondary">
                  The next clean integration step is replacing the mock auth service with real backend endpoints.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </PageSection>
  );
}
