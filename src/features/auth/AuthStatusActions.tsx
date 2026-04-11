"use client";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";

export function AuthStatusActions() {
  const router = useRouter();
  const { session, isLoading, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (isLoading) {
    return <CircularProgress size={24} />;
  }

  if (!session) {
    return (
      <Stack direction="row" spacing={1.5}>
        <Button href="/listings" color="inherit">
          Browse
        </Button>
        <Button href="/login" color="inherit">
          Login
        </Button>
        <Button href="/register" variant="contained">
          Get Started
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Typography color="text.secondary" sx={{ display: { xs: "none", md: "block" } }}>
        {session.user.fullName}
      </Typography>
      <Button href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} color="inherit">
        Dashboard
      </Button>
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>
    </Stack>
  );
}
