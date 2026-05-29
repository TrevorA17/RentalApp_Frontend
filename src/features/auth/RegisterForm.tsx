"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard } from "@/features/auth/AuthCard";
import { useAuth } from "@/features/auth/AuthProvider";
import { extractApiError } from "@/lib/api/client";
import type { RegisterRequest } from "@/types/auth";
import { type RegisterFormValues, registerSchema } from "@/validations/auth";

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
  const { register, session, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [isLoading, router, session]);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      role: "RENTER",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setFormError(null);
      try {
        await register({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role as RegisterRequest["role"],
        });
        router.replace("/dashboard");
      } catch (error) {
        setFormError(extractApiError(error));
      }
    },
  });

  return (
    <AuthCard
      eyebrow="Join the marketplace"
      title="Create your account"
      description="Choose the role that matches how you will use the rental marketplace."
    >
      <Stack component="form" spacing={2.5} onSubmit={formik.handleSubmit}>
        {formError ? <Alert severity="error">{formError}</Alert> : null}
        <TextField
          label="Full name"
          autoComplete="name"
          fullWidth
          {...formik.getFieldProps("fullName")}
          error={Boolean(formik.touched.fullName && formik.errors.fullName)}
          helperText={
            (formik.touched.fullName && formik.errors.fullName) || undefined
          }
        />
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
          autoComplete="new-password"
          fullWidth
          {...formik.getFieldProps("password")}
          error={Boolean(formik.touched.password && formik.errors.password)}
          helperText={
            (formik.touched.password && formik.errors.password) ||
            "Use at least 8 characters."
          }
        />
        <Stack spacing={1}>
          <Typography fontWeight={700}>Choose your primary role</Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            {roleOptions.map((option) => {
              const isSelected = option.role === formik.values.role;

              return (
                <Paper
                  key={option.role}
                  component="button"
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => formik.setFieldValue("role", option.role)}
                  sx={{
                    flex: 1,
                    p: 2,
                    cursor: "pointer",
                    textAlign: "left",
                    font: "inherit",
                    color: "inherit",
                    background: "transparent",
                    border: 0,
                    borderColor: isSelected
                      ? "primary.main"
                      : "rgba(19, 34, 58, 0.08)",
                    outline: isSelected
                      ? "2px solid rgba(19, 93, 102, 0.18)"
                      : "none",
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
          {formik.touched.role && formik.errors.role ? (
            <Typography color="error">{formik.errors.role}</Typography>
          ) : null}
        </Stack>
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Creating account..." : "Create account"}
        </Button>
        <Divider />
        <Typography variant="body2" color="text.secondary">
          Account creation calls the backend register endpoint and signs you in
          immediately after success.
        </Typography>
        <Typography color="text.secondary">
          Already registered? <Link href="/login">Sign in here</Link>.
        </Typography>
      </Stack>
    </AuthCard>
  );
}
