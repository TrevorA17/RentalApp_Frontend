import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PageSection } from "@/components/shell/PageSection";

export default function HomePage() {
  return (
    <PageSection>
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
            This frontend scaffold is aligned to the BRD, route map, and API contract. Auth,
            listing discovery, and profile modules will plug into this shell.
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
    </PageSection>
  );
}
