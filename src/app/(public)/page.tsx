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
              Browse live listings, save favorites, send inquiries, manage property uploads, review moderation flows,
              and try AI-assisted listing descriptions from one connected MVP.
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
                <Typography variant="h5">End-to-end user flows</Typography>
                <Typography color="text.secondary">
                  Registration, login, listing management, saving, inquiries, reports, admin moderation, and AI assist are already connected.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={1.5}>
                <Chip label="Live data" color="primary" sx={{ width: "fit-content" }} />
                <Typography variant="h5">Listings and renter discovery</Typography>
                <Typography color="text.secondary">
                  Public browse, detail pages, saved listings, recommendations, and inquiry tracking all use the running backend.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Stack spacing={1.5}>
                <Chip label="Use it" sx={{ width: "fit-content" }} />
                <Typography variant="h5">Test the platform from the UI</Typography>
                <Typography color="text.secondary">
                  Sign in as renter, agent, landlord, or admin and validate the MVP straight from the frontend without relying on raw endpoint calls.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </PageSection>
  );
}
