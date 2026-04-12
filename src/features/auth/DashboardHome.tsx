"use client";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/features/auth/AuthProvider";
import { SuggestedListingsPanel } from "@/features/suggestions/SuggestedListingsPanel";
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
    summary: "Browse live listings, shortlist strong options, and follow every inquiry from one place.",
    actions: [
      { href: "/listings", label: "Browse listings" },
      { href: "/saved-listings", label: "View saved listings" },
      { href: "/inquiries/sent", label: "Track sent inquiries" },
    ],
  },
  AGENT: {
    title: "Agent workspace",
    summary: "Keep your profile credible, publish stronger listings, and respond to renter leads quickly.",
    actions: [
      { href: "/my-listings", label: "Manage listings" },
      { href: "/inquiries/received", label: "Review inquiries" },
      { href: "/my-listings/new", label: "Create with AI assist" },
    ],
  },
  LANDLORD: {
    title: "Landlord workspace",
    summary: "Publish available units, improve descriptions, and stay on top of incoming interest.",
    actions: [
      { href: "/my-listings", label: "Manage listings" },
      { href: "/inquiries/received", label: "Review inquiries" },
      { href: "/my-listings/new", label: "Create with AI assist" },
    ],
  },
  ADMIN: {
    title: "Admin workspace",
    summary: "Moderate listings, resolve reports, and keep platform trust visible from the UI.",
    actions: [
      { href: "/admin", label: "Open admin area" },
      { href: "/admin/listings", label: "Moderate listings" },
      { href: "/admin/reports", label: "Review reports" },
      { href: "/admin/users", label: "Manage users" },
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
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.8 }}>
            {copy.title}
          </Typography>
          <Typography color="text.secondary" maxWidth={720}>
            {copy.summary}
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={720}>
            This workspace is wired to the live backend modules, so you can test browsing, saving, inquiries,
            moderation, and AI-assisted listing creation directly from the frontend.
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {copy.actions.map((action) => (
          <Grid key={action.href} size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: 3,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,250,244,0.96))",
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h5">{action.label}</Typography>
                <Typography color="text.secondary">
                  Open this route to validate the current MVP flow from the UI.
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

      <SuggestedListingsPanel />
    </Stack>
  );
}
