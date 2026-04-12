"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthCard } from "@/features/auth/AuthCard";
import { useAuth } from "@/features/auth/AuthProvider";

type LoginErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, session, isLoading, isSubmitting } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(redirectTarget);
    }
  }, [isLoading, redirectTarget, router, session]);

  function validate() {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setFormError(null);

    try {
      await login({
        email,
        password,
      });
      router.replace(redirectTarget);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to log in.";
      setFormError(message);
    }
  }

  return (
    <AuthCard
      eyebrow="Module 1"
      title="Sign in"
      description="Sign in against the backend auth API. The same page structure is now using the real register, login, and me endpoints."
    >
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        {formError ? <Alert severity="error">{formError}</Alert> : null}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
          autoComplete="email"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
          autoComplete="current-password"
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <Divider />
        <Stack spacing={0.75}>
          <Typography variant="body2" color="text.secondary">
            Use an account created through the registration page, then sign in with the same credentials.
          </Typography>
        </Stack>
        <Typography color="text.secondary">
          Need an account? <Link href="/register">Create one here</Link>.
        </Typography>
      </Stack>
    </AuthCard>
  );
}
