"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { createReport } from "@/lib/api/reports";

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
  const [reason, setReason] = useState(defaultReasons[0]);
  const [details, setDetails] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canReport =
    !!session &&
    session.user.role !== "ADMIN" &&
    session.user.id !== reportedUserId;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await createReport({
        listingId,
        reportedUserId,
        reason,
        details: details.trim() || undefined,
      });
      setSuccessMessage("Report submitted successfully.");
      setDetails("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit report.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
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
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          fullWidth
        >
          {defaultReasons.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Additional details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        <Stack direction="row">
          <Button
            type="submit"
            variant="outlined"
            color="error"
            disabled={isSubmitting || !canReport}
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
