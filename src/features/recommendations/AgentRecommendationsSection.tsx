"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { extractApiError } from "@/lib/api/client";
import { createAgentRecommendation } from "@/lib/api/recommendations";
import type { AgentRecommendation } from "@/types/domain";
import {
  type RecommendationFormValues,
  recommendationSchema,
} from "@/validations/recommendation";

type AgentRecommendationsSectionProps = {
  agentUserId: string;
  initialRecommendations: AgentRecommendation[];
};

const ratingOptions = [5, 4, 3, 2, 1];

export function AgentRecommendationsSection({
  agentUserId,
  initialRecommendations,
}: AgentRecommendationsSectionProps) {
  const { session } = useAuth();
  const [items] = useState(initialRecommendations);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const alreadySubmitted =
    !!session && items.some((item) => item.author.userId === session.user.id);
  const isOwnProfile = session?.user.id === agentUserId;
  const canSubmit =
    !!session &&
    session.user.role !== "ADMIN" &&
    !alreadySubmitted &&
    !isOwnProfile;

  const formik = useFormik<RecommendationFormValues>({
    initialValues: { rating: 5, comment: "" },
    validationSchema: recommendationSchema,
    onSubmit: async (values, helpers) => {
      if (!session || !canSubmit) return;
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        await createAgentRecommendation(agentUserId, values);
        helpers.resetForm({ values: { rating: 5, comment: "" } });
        setSuccessMessage(
          "Recommendation submitted for admin review. It will appear publicly after approval.",
        );
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    },
  });

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Chip
              label="Trust signals"
              color="secondary"
              sx={{ width: "fit-content" }}
            />
            <Typography variant="h5">
              Recommendations and testimonials
            </Typography>
            <Typography color="text.secondary">
              Public feedback helps renters understand how this agent
              communicates, follows through, and handles viewings.
            </Typography>
          </Stack>

          {items.length === 0 ? (
            <Typography color="text.secondary">
              No public recommendations yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {items.map((item) => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2.5 }}>
                  <Stack spacing={1.25}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Stack spacing={0.5}>
                        <Typography fontWeight={700}>
                          {item.author.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.author.role}
                        </Typography>
                      </Stack>
                      <Stack
                        spacing={0.5}
                        alignItems={{ xs: "flex-start", sm: "flex-end" }}
                      >
                        <Rating value={item.rating} precision={1} readOnly />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography color="text.secondary">
                      {item.comment}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack component="form" spacing={2} onSubmit={formik.handleSubmit}>
          <Typography variant="h6">Leave a recommendation</Typography>
          <Typography color="text.secondary">
            Keep it factual and concise. One recommendation per account keeps
            this simple for the MVP.
          </Typography>

          {!session ? (
            <Alert severity="info">
              Sign in to leave a recommendation for this agent.
            </Alert>
          ) : null}
          {session?.user.role === "ADMIN" ? (
            <Alert severity="info">
              Admin accounts cannot leave public recommendations.
            </Alert>
          ) : null}
          {isOwnProfile ? (
            <Alert severity="info">
              You cannot recommend your own agent profile.
            </Alert>
          ) : null}
          {alreadySubmitted ? (
            <Alert severity="success">
              You have already left a recommendation for this agent.
            </Alert>
          ) : null}
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? (
            <Alert severity="success">{successMessage}</Alert>
          ) : null}

          <TextField
            select
            label="Rating"
            disabled={!canSubmit || formik.isSubmitting}
            sx={{ maxWidth: 220 }}
            value={formik.values.rating}
            onChange={(event) =>
              formik.setFieldValue("rating", Number(event.target.value))
            }
            onBlur={() => formik.setFieldTouched("rating", true)}
            error={Boolean(formik.touched.rating && formik.errors.rating)}
            helperText={
              (formik.touched.rating && formik.errors.rating) || undefined
            }
          >
            {ratingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option} / 5
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Recommendation"
            multiline
            minRows={4}
            disabled={!canSubmit || formik.isSubmitting}
            {...formik.getFieldProps("comment")}
            error={Boolean(formik.touched.comment && formik.errors.comment)}
            helperText={
              (formik.touched.comment && formik.errors.comment) ||
              "Focus on communication, transparency, reliability, and overall experience."
            }
          />

          <Stack direction="row">
            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit || formik.isSubmitting}
            >
              {formik.isSubmitting ? "Submitting..." : "Submit recommendation"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
