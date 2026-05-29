"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Building2 } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { AuthStatusActions } from "@/features/auth/AuthStatusActions";

export function PublicMarketplaceShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Stack
              component={Link}
              href="/"
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{
                textDecoration: "none",
                color: "text.primary",
                minWidth: 0,
              }}
            >
              <Stack
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building2 size={18} />
              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                RentalApp
              </Typography>
            </Stack>
            <Box sx={{ flex: 1 }} />
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button component={Link} href="/listings" color="inherit">
                Browse
              </Button>
              <Button component={Link} href="/register" color="inherit">
                List a property
              </Button>
            </Stack>
            <AuthStatusActions />
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          mt: "auto",
          py: 4,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">RentalApp</Typography>
              <Typography variant="body2" color="text.secondary">
                Rental-first marketplace with structured search and verified
                agents.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button component={Link} href="/listings" size="small">
                Browse
              </Button>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="small"
              >
                Create account
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
