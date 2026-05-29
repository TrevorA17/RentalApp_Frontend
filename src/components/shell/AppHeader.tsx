"use client";

import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import ExploreRounded from "@mui/icons-material/ExploreRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { AuthStatusActions } from "@/features/auth/AuthStatusActions";

export function AppHeader() {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        px: { xs: 2, md: 4 },
        py: 1.75,
        backdropFilter: "blur(20px)",
        background:
          "linear-gradient(180deg, rgba(252, 245, 234, 0.92), rgba(243, 240, 234, 0.8))",
        borderBottom: "1px solid rgba(19, 34, 58, 0.08)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack
          component={Link}
          href="/"
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ minWidth: 0 }}
        >
          <ApartmentRounded color="primary" />
          <Stack spacing={0.15}>
            <Typography variant="h6" fontWeight={800}>
              RentalApp
            </Typography>
            <Chip
              label="Live rental workflow"
              size="small"
              color="secondary"
              sx={{ width: "fit-content", height: 22, fontWeight: 700 }}
            />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            href="/listings"
            color="inherit"
            startIcon={<ExploreRounded />}
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            Explore
          </Button>
          <AuthStatusActions />
        </Stack>
      </Stack>
    </Box>
  );
}
