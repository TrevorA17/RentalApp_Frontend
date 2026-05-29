"use client";

import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { AuthGuard } from "@/features/auth/AuthGuard";
import { AuthStatusActions } from "@/features/auth/AuthStatusActions";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

type WorkspaceShellProps = PropsWithChildren<{
  mode: "app" | "admin";
}>;

export function WorkspaceShell({ children, mode }: WorkspaceShellProps) {
  return (
    <AuthGuard allowedRoles={mode === "admin" ? ["ADMIN"] : undefined}>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            mode === "admin"
              ? "linear-gradient(135deg, rgba(14,107,115,0.08), rgba(22,35,56,0.05))"
              : "linear-gradient(135deg, rgba(200,107,42,0.08), rgba(14,107,115,0.06))",
        }}
      >
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 25,
            borderBottom: "1px solid rgba(19, 34, 58, 0.08)",
            backdropFilter: "blur(20px)",
            background: "rgba(252, 245, 234, 0.9)",
          }}
        >
          <Container maxWidth={false} sx={{ px: { xs: 2, md: 3 }, py: 1.3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack
                component={Link}
                href="/dashboard"
                direction="row"
                alignItems="center"
                spacing={1.1}
              >
                <ApartmentRounded color="primary" />
                <Stack spacing={0}>
                  <Typography fontWeight={900} lineHeight={1}>
                    RentalApp
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    {mode === "admin" ? "Trust operations" : "Workspace"}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                  href="/listings"
                  color="inherit"
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  Marketplace
                </Button>
                <AuthStatusActions />
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container
          maxWidth={false}
          sx={{ px: { xs: 2, md: 3 }, py: { xs: 2.5, md: 3.5 } }}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={3}
            alignItems="flex-start"
          >
            <WorkspaceSidebar mode={mode} />
            <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>{children}</Box>
          </Stack>
        </Container>
      </Box>
    </AuthGuard>
  );
}
