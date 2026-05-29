"use client";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { UserMenu } from "@/components/shell/UserMenu";
import { useAuth } from "@/features/auth/AuthProvider";

export function AuthStatusActions() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <CircularProgress size={20} />;
  }

  if (!session) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          component={Link}
          href="/login"
          color="inherit"
          size="small"
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          Sign in
        </Button>
        <Button
          component={Link}
          href="/register"
          variant="contained"
          size="small"
        >
          Get started
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        component={Link}
        href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
        color="inherit"
        size="small"
        sx={{ display: { xs: "none", sm: "inline-flex" } }}
      >
        Dashboard
      </Button>
      <UserMenu />
    </Stack>
  );
}
