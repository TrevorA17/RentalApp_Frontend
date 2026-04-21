"use client";

import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { AuthStatusActions } from "@/features/auth/AuthStatusActions";

const publicLinks = [
  { href: "/listings", label: "Browse rentals" },
  { href: "/register", label: "Post a listing" },
];

export function PublicMarketplaceShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: "1px solid rgba(19, 34, 58, 0.08)",
          backdropFilter: "blur(22px)",
          background: "rgba(252, 245, 234, 0.88)",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 1.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack component={Link} href="/" direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  background: "linear-gradient(135deg, #0e6b73, #c86b2a)",
                }}
              >
                <ApartmentRounded />
              </Box>
              <Stack spacing={0}>
                <Typography variant="h6" fontWeight={900} lineHeight={1}>
                  RentalApp
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                  Rental-first marketplace
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
                {publicLinks.map((item) => (
                  <Button key={item.href} href={item.href} color="inherit">
                    {item.label}
                  </Button>
                ))}
              </Stack>
              <AuthStatusActions />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          mt: { xs: 5, md: 8 },
          py: { xs: 4, md: 5 },
          borderTop: "1px solid rgba(19, 34, 58, 0.08)",
          background: "linear-gradient(180deg, rgba(255,250,244,0.75), rgba(14,107,115,0.08))",
        }}
      >
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Stack spacing={0.75}>
              <Typography variant="h6">RentalApp</Typography>
              <Typography color="text.secondary" maxWidth={560}>
                A rental-only marketplace for cleaner search, richer listings, and trust signals around agents and landlords.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Button href="/listings" variant="outlined">
                Browse rentals
              </Button>
              <Button href="/register" variant="contained">
                Create account
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
