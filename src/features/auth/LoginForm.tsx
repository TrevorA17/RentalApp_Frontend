"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/features/auth/AuthCard";
import { useAuth } from "@/features/auth/AuthProvider";
import { extractApiError } from "@/lib/api/client";
import { type LoginFormValues, loginSchema } from "@/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, session, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(redirectTarget);
    }
  }, [isLoading, redirectTarget, router, session]);

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setFormError(null);
      try {
        await login(values);
        router.replace(redirectTarget);
      } catch (error) {
        setFormError(extractApiError(error));
      }
    },
  });

  return (
    <AuthCard
      eyebrow="Secure access"
      title="Sign in"
      description="Access your renter, agent, landlord, or admin workspace with the live backend auth flow."
    >
      <Stack component="form" spacing={2} onSubmit={formik.handleSubmit}>
        {formError ? <Alert severity="error">{formError}</Alert> : null}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          {...formik.getFieldProps("email")}
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={
            (formik.touched.email && formik.errors.email) || undefined
          }
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
          {...formik.getFieldProps("password")}
          error={Boolean(formik.touched.password && formik.errors.password)}
          helperText={
            (formik.touched.password && formik.errors.password) || undefined
          }
        />
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <Divider />
        <Stack spacing={0.75}>
          <Typography variant="body2" color="text.secondary">
            Use an account created through the registration page, then sign in
            with the same credentials.
          </Typography>
        </Stack>
        <Typography color="text.secondary">
          Need an account? <Link href="/register">Create one here</Link>.
        </Typography>
      </Stack>
    </AuthCard>
  );
}
