"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { createInquiry } from "@/lib/api/inquiries";
import { ListingDetail } from "@/types/domain";

type InquiryComposerProps = {
  listing: ListingDetail;
};

export function InquiryComposer({ listing }: InquiryComposerProps) {
  const { session } = useAuth();
  const [message, setMessage] = useState(
    `Hi ${listing.poster.fullName}, I am interested in ${listing.title}. Is it still available?`,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canInquire = !!session && session.user.id !== listing.poster.userId && session.user.role !== "ADMIN";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.accessToken) {
      setErrorMessage("Sign in to contact the listing owner.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await createInquiry(session.accessToken, listing.id, { message });
      setSuccessMessage("Inquiry sent successfully.");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Failed to send inquiry.";
      setErrorMessage(nextMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Typography variant="h5">Contact about this listing</Typography>
          <Typography color="text.secondary">
            Send a direct inquiry to the poster. They will see it in their received inquiries inbox.
          </Typography>
        </Stack>

        {!canInquire ? (
          <Alert severity="info">
            {session
              ? "You cannot send an inquiry for your own listing."
              : "Sign in to contact the listing owner."}
          </Alert>
        ) : null}

        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          label="Message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          multiline
          minRows={4}
          fullWidth
        />

        <Stack direction="row" justifyContent="flex-start">
          <Button type="submit" variant="contained" disabled={!canInquire || isSubmitting}>
            Send inquiry
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
