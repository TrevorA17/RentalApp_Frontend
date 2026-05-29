"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import type { Role } from "@/types/domain";

type AuthGuardProps = PropsWithChildren<{
  allowedRoles?: Role[];
}>;

export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!session) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.replace("/dashboard");
    }
  }, [allowedRoles, isLoading, pathname, router, session]);

  if (
    isLoading ||
    !session ||
    (allowedRoles && !allowedRoles.includes(session.user.role))
  ) {
    return (
      <Paper sx={{ p: 6 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">
            Preparing your workspace...
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return <>{children}</>;
}
