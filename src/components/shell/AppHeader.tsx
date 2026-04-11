"use client";

import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import Box from "@mui/material/Box";
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
        py: 2,
        backdropFilter: "blur(18px)",
        backgroundColor: "rgba(243, 246, 251, 0.82)",
        borderBottom: "1px solid rgba(19, 34, 58, 0.08)",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack component={Link} href="/" direction="row" spacing={1.25} alignItems="center">
          <ApartmentRounded color="primary" />
          <Stack spacing={0.15}>
            <Typography variant="h6" fontWeight={800}>
              RentalApp
            </Typography>
            <Chip
              label="Rental-first MVP"
              size="small"
              color="secondary"
              sx={{ width: "fit-content", height: 22, fontWeight: 700 }}
            />
          </Stack>
        </Stack>

        <AuthStatusActions />
      </Stack>
    </Box>
  );
}
