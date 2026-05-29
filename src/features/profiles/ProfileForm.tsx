"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { extractApiError } from "@/lib/api/client";
import { getMyProfile, saveMyProfile } from "@/lib/api/profiles";
import { type ProfileFormValues, profileSchema } from "@/validations/profile";

export function ProfileForm() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAgent = session?.user.role === "AGENT";

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      bio: "",
      city: "",
      serviceAreas: "",
      companyName: "",
      feeStructure: "",
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        await saveMyProfile({
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          bio: values.bio,
          city: values.city,
          serviceAreas: values.serviceAreas
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          companyName: isAgent ? values.companyName : undefined,
          feeStructure: isAgent ? values.feeStructure : undefined,
        });
        setSuccessMessage("Profile saved successfully.");
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-shot load on session change
  useEffect(() => {
    async function loadProfile() {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getMyProfile();
        formik.resetForm({
          values: {
            fullName: profile.fullName ?? "",
            phoneNumber: profile.phoneNumber ?? "",
            bio: profile.bio ?? "",
            city: profile.city ?? "",
            serviceAreas: (profile.serviceAreas ?? []).join(", "),
            companyName: profile.companyName ?? "",
            feeStructure: profile.feeStructure ?? "",
          },
        });
      } catch (error) {
        setErrorMessage(extractApiError(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [session]);

  if (!session) {
    return null;
  }

  const disabled = isLoading || formik.isSubmitting;

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Chip
            label={`${session.user.role} profile`}
            color="secondary"
            sx={{ width: "fit-content" }}
          />
          <Typography variant="h3">Manage profile</Typography>
          <Typography color="text.secondary" maxWidth={720}>
            This profile data will power listing poster summaries, public trust
            signals, and later agent profile views.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack component="form" spacing={2.5} onSubmit={formik.handleSubmit}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? (
            <Alert severity="success">{successMessage}</Alert>
          ) : null}

          <TextField
            label="Full name"
            fullWidth
            required
            disabled={disabled}
            {...formik.getFieldProps("fullName")}
            error={Boolean(formik.touched.fullName && formik.errors.fullName)}
            helperText={
              (formik.touched.fullName && formik.errors.fullName) || undefined
            }
          />
          <TextField
            label="Phone number"
            fullWidth
            disabled={disabled}
            {...formik.getFieldProps("phoneNumber")}
          />
          <TextField
            label="City"
            fullWidth
            disabled={disabled}
            {...formik.getFieldProps("city")}
          />
          <TextField
            label="Bio"
            fullWidth
            minRows={4}
            multiline
            disabled={disabled}
            {...formik.getFieldProps("bio")}
          />
          <TextField
            label="Service areas"
            fullWidth
            disabled={disabled}
            helperText="Separate areas with commas."
            {...formik.getFieldProps("serviceAreas")}
          />

          {isAgent ? (
            <>
              <TextField
                label="Company name"
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("companyName")}
              />
              <TextField
                label="Fee structure"
                fullWidth
                minRows={3}
                multiline
                disabled={disabled}
                {...formik.getFieldProps("feeStructure")}
              />
            </>
          ) : null}

          <Stack direction="row">
            <Button type="submit" variant="contained" disabled={disabled}>
              {formik.isSubmitting ? "Saving..." : "Save profile"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
