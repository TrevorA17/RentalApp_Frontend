"use client";

import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export function AppHeader() {
  return (
    <Stack
      component="header"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ px: { xs: 2, md: 4 }, py: 2.5 }}
    >
      <Stack component={Link} href="/" direction="row" spacing={1.25} alignItems="center">
        <ApartmentRounded color="primary" />
        <Typography variant="h6" fontWeight={800}>
          RentalApp
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <Button component={Link} href="/listings" color="inherit">
          Browse
        </Button>
        <Button component={Link} href="/login" color="inherit">
          Login
        </Button>
        <Button component={Link} href="/register" variant="contained">
          Get Started
        </Button>
      </Stack>
    </Stack>
  );
}
