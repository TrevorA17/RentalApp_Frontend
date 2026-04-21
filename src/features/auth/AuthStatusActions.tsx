"use client";

import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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
      <Stack direction="row" spacing={{ xs: 0.75, sm: 1.5 }} alignItems="center">
        <Button href="/listings" color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
          Browse
        </Button>
        <Button href="/login" color="inherit">
          Login
        </Button>
        <Button href="/register" variant="contained" sx={{ whiteSpace: "nowrap" }}>
          Get started
        </Button>
      </Stack>
    );
  }

  const primaryHref =
    session.user.role === "ADMIN"
      ? "/admin"
      : session.user.role === "RENTER"
        ? "/saved-listings"
        : "/my-listings";

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Stack spacing={0.3} sx={{ display: { xs: "none", md: "flex" }, minWidth: 0 }}>
        <Typography color="text.primary" fontWeight={700} noWrap>
          {session.user.fullName}
        </Typography>
        <Chip
          label={session.user.role.toLowerCase()}
          size="small"
          sx={{ width: "fit-content", textTransform: "capitalize", bgcolor: "rgba(14,107,115,0.08)" }}
        />
      </Stack>
      <Button href="/listings" color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
        Browse
      </Button>
      <Button href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>
        Workspace
      </Button>
      <Button href={primaryHref} color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>
        {session.user.role === "ADMIN"
          ? "Reports"
          : session.user.role === "RENTER"
            ? "Saved"
            : "Listings"}
      </Button>
      <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ whiteSpace: "nowrap" }}>
        Logout
      </Button>
    </Stack>
  );
}
