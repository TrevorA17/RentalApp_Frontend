"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  ArrowRight,
  type LucideIcon,
  Search,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";

const benefits: Array<{
  title: string;
  body: string;
  icon: LucideIcon;
}> = [
  {
    title: "Rental-first search",
    body: "Filters built around renting decisions — area, budget, bedrooms, amenities, availability.",
    icon: Search,
  },
  {
    title: "Trust around agents",
    body: "Public recommendations and admin moderation help you judge who you're dealing with.",
    icon: Shield,
  },
  {
    title: "AI that helps, not hypes",
    body: "Translate plain-language requests into structured filters. Real search stays in control.",
    icon: Sparkles,
  },
  {
    title: "Verified reviews",
    body: "Moderated recommendations on agent profiles give you signal before a viewing.",
    icon: Star,
  },
];

export default function HomePage() {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip
              label="Rental marketplace"
              size="small"
              sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
            />
            <Typography variant="h1" sx={{ maxWidth: 760 }}>
              Find rentals with the trust signals you actually need.
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 620, fontWeight: 400 }}
            >
              Browse verified listings, save shortlists, and contact landlords
              or agents you can vet — all in one place.
            </Typography>

            {/* Search card */}
            <Paper
              component={Link}
              href="/listings"
              sx={{
                width: "100%",
                maxWidth: 580,
                p: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "text.secondary",
                transition: "border-color 120ms ease",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Box sx={{ pl: 1.5, display: "flex", color: "primary.main" }}>
                <Search size={18} />
              </Box>
              <Typography sx={{ flex: 1, py: 1.25 }}>
                Search by city, area, or budget…
              </Typography>
              <Button
                component="span"
                variant="contained"
                size="small"
                endIcon={<ArrowRight size={16} />}
              >
                Browse
              </Button>
            </Paper>

            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/register"
                variant="outlined"
                size="large"
              >
                Create account
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="text"
                size="large"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Benefits */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack
          spacing={1.5}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 5 }}
        >
          <Typography variant="overline" color="primary.main">
            Why RentalApp
          </Typography>
          <Typography variant="h2">
            A cleaner alternative to classifieds.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
            Built for the specific shape of renting — better listings, better
            trust, better tools for both sides.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {benefits.map(({ title, body, icon: Icon }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2.5, height: "100%" }}>
                <Stack spacing={1.5}>
                  <Stack
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} />
                  </Stack>
                  <Typography variant="h5">{title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {body}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Two-up role split */}
      <Box
        sx={{
          bgcolor: "grey.50",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
                <Stack spacing={2}>
                  <Chip
                    label="For renters"
                    size="small"
                    color="primary"
                    sx={{ width: "fit-content" }}
                  />
                  <Typography variant="h3">
                    Shortlist homes with less guesswork.
                  </Typography>
                  <Stack spacing={1} color="text.secondary">
                    <Typography>
                      · Filter by area, budget, and bedrooms
                    </Typography>
                    <Typography>· Save listings and track inquiries</Typography>
                    <Typography>
                      · Read recommendations before viewing
                    </Typography>
                  </Stack>
                  <Button
                    component={Link}
                    href="/listings"
                    variant="contained"
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                  >
                    Browse rentals
                  </Button>
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
                <Stack spacing={2}>
                  <Chip
                    label="For agents and landlords"
                    size="small"
                    color="secondary"
                    sx={{ width: "fit-content" }}
                  />
                  <Typography variant="h3">
                    Manage listings from a real workspace.
                  </Typography>
                  <Stack spacing={1} color="text.secondary">
                    <Typography>
                      · Publish listings with photos and fees
                    </Typography>
                    <Typography>· Use AI to strengthen descriptions</Typography>
                    <Typography>
                      · Reply to inquiries and build trust
                    </Typography>
                  </Stack>
                  <Button
                    component={Link}
                    href="/register"
                    variant="outlined"
                    sx={{ alignSelf: "flex-start", mt: 1 }}
                  >
                    Get started
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderColor: "primary.main",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Typography variant="h2" sx={{ maxWidth: 640 }}>
              Ready to find your next rental?
            </Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 540 }}>
              Free to browse. Save shortlists, message agents, and report issues
              when you sign in.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={Link}
                href="/listings"
                variant="contained"
                color="secondary"
                size="large"
              >
                Browse rentals
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="outlined"
                size="large"
                sx={{
                  color: "primary.contrastText",
                  borderColor: "rgba(255,255,255,0.4)",
                  "&:hover": { borderColor: "primary.contrastText" },
                }}
              >
                Create account
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
