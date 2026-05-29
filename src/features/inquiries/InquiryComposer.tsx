"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { extractApiError } from "@/lib/api/client";
import { createInquiry } from "@/lib/api/inquiries";
import type { ListingDetail } from "@/types/domain";
import { type InquiryFormValues, inquirySchema } from "@/validations/inquiry";

type InquiryComposerProps = {
  listing: ListingDetail;
};

export function InquiryComposer({ listing }: InquiryComposerProps) {
  const { session } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const canInquire =
    !!session &&
    session.user.id !== listing.poster.userId &&
    session.user.role !== "ADMIN";

  const formik = useFormik<InquiryFormValues>({
    initialValues: {
      message: `Hi ${listing.poster.fullName}, I am interested in ${listing.title}. Is it still available?`,
    },
    validationSchema: inquirySchema,
    onSubmit: async (values) => {
      if (!session) {
        setErrorMessage("Sign in to contact the listing owner.");
        return;
      }
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        await createInquiry(listing.id, { message: values.message.trim() });
        setSuccessMessage("Inquiry sent successfully.");
        setHasSubmitted(true);
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    },
  });

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={2.5} component="form" onSubmit={formik.handleSubmit}>
        <Stack spacing={1}>
          <Typography variant="h5">Contact about this listing</Typography>
          <Typography color="text.secondary">
            Send a direct inquiry to the poster. They will see it in their
            received inquiries inbox.
          </Typography>
        </Stack>

        {!canInquire ? (
          <Alert severity="info">
            {session
              ? session.user.role === "ADMIN"
                ? "Admin users cannot send listing inquiries."
                : "You cannot send an inquiry for your own listing."
              : "Sign in to contact the listing owner."}
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert severity="success">{successMessage}</Alert>
        ) : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          label="Message"
          multiline
          minRows={4}
          fullWidth
          {...formik.getFieldProps("message")}
          error={Boolean(formik.touched.message && formik.errors.message)}
          helperText={
            (formik.touched.message && formik.errors.message) || undefined
          }
        />

        <Stack direction="row" justifyContent="flex-start">
          <Button
            type="submit"
            variant="contained"
            disabled={!canInquire || formik.isSubmitting || hasSubmitted}
          >
            Send inquiry
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
