"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { extractApiError } from "@/lib/api/client";
import { createReport } from "@/lib/api/reports";
import { type ReportFormValues, reportSchema } from "@/validations/report";

type ReportComposerProps = {
  listingId: string;
  reportedUserId: string;
};

const defaultReasons = [
  "Suspicious listing information",
  "Spam or duplicate content",
  "Harassment or scam concern",
  "Inappropriate media or description",
];

export function ReportComposer({
  listingId,
  reportedUserId,
}: ReportComposerProps) {
  const { session } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canReport =
    !!session &&
    session.user.role !== "ADMIN" &&
    session.user.id !== reportedUserId;

  const formik = useFormik<ReportFormValues>({
    initialValues: { reason: defaultReasons[0], details: "" },
    validationSchema: reportSchema,
    onSubmit: async (values, helpers) => {
      if (!session) {
        setErrorMessage("Sign in to submit a report.");
        return;
      }
      if (!canReport) {
        setErrorMessage(
          "You cannot report this listing from your current account.",
        );
        return;
      }
      setSuccessMessage(null);
      setErrorMessage(null);
      try {
        await createReport({
          listingId,
          reportedUserId,
          reason: values.reason,
          details: values.details.trim() || undefined,
        });
        setSuccessMessage("Report submitted successfully.");
        helpers.setFieldValue("details", "");
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    },
  });

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack component="form" spacing={2} onSubmit={formik.handleSubmit}>
        <Stack spacing={1}>
          <Typography variant="h5">Report this listing</Typography>
          <Typography color="text.secondary">
            Flag suspicious or abusive content so the admin team can review it.
          </Typography>
        </Stack>

        {successMessage ? (
          <Alert severity="success">{successMessage}</Alert>
        ) : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          select
          label="Reason"
          fullWidth
          {...formik.getFieldProps("reason")}
          error={Boolean(formik.touched.reason && formik.errors.reason)}
          helperText={
            (formik.touched.reason && formik.errors.reason) || undefined
          }
        >
          {defaultReasons.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Additional details"
          multiline
          minRows={3}
          fullWidth
          {...formik.getFieldProps("details")}
          error={Boolean(formik.touched.details && formik.errors.details)}
          helperText={
            (formik.touched.details && formik.errors.details) || undefined
          }
        />

        <Stack direction="row">
          <Button
            type="submit"
            variant="outlined"
            color="error"
            disabled={formik.isSubmitting || !canReport}
          >
            Submit report
          </Button>
        </Stack>
        {!canReport ? (
          <Alert severity="info">
            {session
              ? session.user.role === "ADMIN"
                ? "Admin users should review reports from the moderation workspace instead of filing them."
                : "You cannot report your own listing."
              : "Sign in to submit a report."}
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}
