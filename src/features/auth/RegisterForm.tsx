"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthCard } from "@/features/auth/AuthCard";
import { useAuth } from "@/features/auth/AuthProvider";
import { RegisterRequest } from "@/types/auth";

type RegisterErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  role?: string;
};

const roleOptions: Array<{
  role: RegisterRequest["role"];
  title: string;
  description: string;
}> = [
  {
    role: "RENTER",
    title: "Renter",
    description: "Browse listings, save favorites, and send inquiries.",
  },
  {
    role: "AGENT",
    title: "Agent",
    description: "Manage listings, show service areas, and receive leads.",
  },
  {
    role: "LANDLORD",
    title: "Landlord",
    description: "Post rentals directly and track incoming inquiries.",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const { register, session, isLoading, isSubmitting } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRequest["role"]>("RENTER");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, session]);

  function validate() {
    const nextErrors: RegisterErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!role) {
      nextErrors.role = "Role is required.";
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
      await register({
        fullName,
        email,
        password,
        role,
      });
      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account.";
      setFormError(message);
    }
  }

  return (
    <AuthCard
      eyebrow="Module 1"
      title="Create your account"
      description="Registration already follows the role model defined in the BRD: renter, agent, and landlord."
    >
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
        {formError ? <Alert severity="error">{formError}</Alert> : null}
        <TextField
          label="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={Boolean(errors.fullName)}
          helperText={errors.fullName}
          autoComplete="name"
          fullWidth
        />
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
          helperText={errors.password || "Use at least 8 characters for the mock flow."}
          autoComplete="new-password"
          fullWidth
        />
        <Stack spacing={1}>
          <Typography fontWeight={700}>Choose your primary role</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            {roleOptions.map((option) => {
              const isSelected = option.role === role;

              return (
                <Paper
                  key={option.role}
                  role="button"
                  tabIndex={0}
                  onClick={() => setRole(option.role)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setRole(option.role);
                    }
                  }}
                  sx={{
                    flex: 1,
                    p: 2,
                    cursor: "pointer",
                    borderColor: isSelected ? "primary.main" : "rgba(19, 34, 58, 0.08)",
                    outline: isSelected ? "2px solid rgba(19, 93, 102, 0.18)" : "none",
                  }}
                >
                  <Stack spacing={1}>
                    <Typography fontWeight={700}>{option.title}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {option.description}
                    </Typography>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
          {errors.role ? <Typography color="error">{errors.role}</Typography> : null}
        </Stack>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
        <Divider />
        <Typography variant="body2" color="text.secondary">
          This remains mock-backed for now. Backend auth will replace the storage layer later without changing the form structure.
        </Typography>
        <Typography color="text.secondary">
          Already registered? <Link href="/login">Sign in here</Link>.
        </Typography>
      </Stack>
    </AuthCard>
  );
}
