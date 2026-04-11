"use client";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/features/auth/AuthProvider";
import { RecommendationsPanel } from "@/features/recommendations/RecommendationsPanel";
import { Role } from "@/types/domain";

const roleCopy: Record<
  Role,
  {
    title: string;
    summary: string;
    actions: Array<{ href: string; label: string }>;
  }
> = {
  RENTER: {
    title: "Renter workspace",
    summary: "Browse listings, save favorites, and keep track of the inquiries you send.",
    actions: [
      { href: "/listings", label: "Browse listings" },
      { href: "/saved-listings", label: "View saved listings" },
    ],
  },
  AGENT: {
    title: "Agent workspace",
    summary: "Manage your professional profile, create listings, and review incoming leads.",
    actions: [
      { href: "/my-listings", label: "Manage listings" },
      { href: "/inquiries/received", label: "Review inquiries" },
    ],
  },
  LANDLORD: {
    title: "Landlord workspace",
    summary: "Create rental listings directly and follow up on interested renters.",
    actions: [
      { href: "/my-listings", label: "Manage listings" },
      { href: "/inquiries/received", label: "Review inquiries" },
    ],
  },
  ADMIN: {
    title: "Admin workspace",
    summary: "Moderate listings, review reports, and maintain platform trust.",
    actions: [
      { href: "/admin", label: "Open admin area" },
      { href: "/admin/listings", label: "Moderate listings" },
    ],
  },
};

export function DashboardHome() {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  const copy = roleCopy[session.user.role];

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          background:
            "linear-gradient(135deg, rgba(19,93,102,0.12), rgba(217,123,41,0.12))",
        }}
      >
        <Stack spacing={2.5}>
          <Chip label={session.user.role} color="secondary" sx={{ width: "fit-content" }} />
          <Typography variant="h3">Welcome back, {session.user.fullName}</Typography>
          <Typography color="text.secondary" maxWidth={720}>
            {copy.summary}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This dashboard is now using the real backend auth session instead of the earlier mock storage flow.
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {copy.actions.map((action) => (
          <Grid key={action.href} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h5">{action.label}</Typography>
                <Typography color="text.secondary">
                  This route is scaffolded now so the next module can be wired without rebuilding navigation.
                </Typography>
                <Stack direction="row">
                  <Button href={action.href} variant="contained">
                    Open
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <RecommendationsPanel />
    </Stack>
  );
}
