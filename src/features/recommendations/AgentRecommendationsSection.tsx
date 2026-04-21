"use client";

import { FormEvent, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAuth } from "@/features/auth/AuthProvider";
import { createAgentRecommendation } from "@/lib/api/recommendations";
import { AgentRecommendation } from "@/types/domain";

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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alreadySubmitted = !!session && items.some((item) => item.author.userId === session.user.id);
  const isOwnProfile = session?.user.id === agentUserId;
  const canSubmit = !!session && session.user.role !== "ADMIN" && !alreadySubmitted && !isOwnProfile;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await createAgentRecommendation(agentUserId, {
        rating,
        comment,
      });
      setComment("");
      setRating(5);
      setSuccessMessage("Recommendation submitted for admin review. It will appear publicly after approval.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit recommendation.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Chip label="Trust signals" color="secondary" sx={{ width: "fit-content" }} />
            <Typography variant="h5">Recommendations and testimonials</Typography>
            <Typography color="text.secondary">
              Public feedback helps renters understand how this agent communicates, follows through, and handles viewings.
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
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={700}>{item.author.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.author.role}
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                        <Rating value={item.rating} precision={1} readOnly />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography color="text.secondary">{item.comment}</Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h6">Leave a recommendation</Typography>
          <Typography color="text.secondary">
            Keep it factual and concise. One recommendation per account keeps this simple for the MVP.
          </Typography>

          {!session ? <Alert severity="info">Sign in to leave a recommendation for this agent.</Alert> : null}
          {session?.user.role === "ADMIN" ? <Alert severity="info">Admin accounts cannot leave public recommendations.</Alert> : null}
          {isOwnProfile ? <Alert severity="info">You cannot recommend your own agent profile.</Alert> : null}
          {alreadySubmitted ? <Alert severity="success">You have already left a recommendation for this agent.</Alert> : null}
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <TextField
            select
            label="Rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            disabled={!canSubmit || isSubmitting}
            sx={{ maxWidth: 220 }}
          >
            {ratingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option} / 5
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Recommendation"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            multiline
            minRows={4}
            disabled={!canSubmit || isSubmitting}
            helperText="Focus on communication, transparency, reliability, and overall experience."
          />

          <Stack direction="row">
            <Button type="submit" variant="contained" disabled={!canSubmit || isSubmitting || comment.trim().length === 0}>
              {isSubmitting ? "Submitting..." : "Submit recommendation"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
