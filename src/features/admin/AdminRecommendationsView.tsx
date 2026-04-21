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
import { useEffect, useState } from "react";
import { getAdminRecommendations, updateAdminRecommendationApproval } from "@/lib/api/admin";
import { AdminAgentRecommendation, ApprovalStatus } from "@/types/domain";

const approvalStatuses: ApprovalStatus[] = ["PENDING", "APPROVED", "REJECTED"];

function statusColor(status: ApprovalStatus): "default" | "success" | "warning" | "error" {
  if (status === "APPROVED") {
    return "success";
  }

  if (status === "REJECTED") {
    return "error";
  }

  return "warning";
}

export function AdminRecommendationsView() {
  const [items, setItems] = useState<AdminAgentRecommendation[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ApprovalStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const result = await getAdminRecommendations();
        setItems(result);
        setDrafts(Object.fromEntries(result.map((item) => [item.id, item.approvalStatus])));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load recommendation moderation queue.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadRecommendations();
  }, []);

  async function handleUpdate(recommendationId: string) {
    try {
      setUpdatingId(recommendationId);
      const updated = await updateAdminRecommendationApproval(recommendationId, drafts[recommendationId]);
      setItems((current) => current.map((item) => (item.id === recommendationId ? updated : item)));
      setSuccessMessage("Recommendation moderation status updated.");
      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update recommendation moderation.";
      setErrorMessage(message);
      setSuccessMessage(null);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Trust operations
        </Typography>
        <Typography variant="h2">Moderate recommendations</Typography>
        <Typography color="text.secondary">
          Review public agent testimonials before they shape trust on agent profiles.
        </Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      {isLoading ? <Alert severity="info">Loading recommendation queue...</Alert> : null}
      {!isLoading && items.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No agent recommendations are currently in the moderation queue.</Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {items.map((item) => (
          <Paper key={item.id} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
                <Stack spacing={0.75}>
                  <Typography variant="h5">{item.agent.fullName}</Typography>
                  <Typography color="text.secondary">Agent: {item.agent.email}</Typography>
                  <Typography color="text.secondary">
                    Author: {item.author.fullName} ({item.author.role}) - {item.author.email}
                  </Typography>
                </Stack>
                <Stack spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                  <Chip label={item.approvalStatus} color={statusColor(item.approvalStatus)} />
                  <Rating value={item.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography color="text.secondary">{item.comment}</Typography>
              </Paper>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label="Approval"
                  value={drafts[item.id] ?? item.approvalStatus}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [item.id]: event.target.value as ApprovalStatus,
                    }))
                  }
                  sx={{ minWidth: 220 }}
                >
                  {approvalStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  onClick={() => handleUpdate(item.id)}
                  disabled={updatingId === item.id || drafts[item.id] === item.approvalStatus}
                >
                  {updatingId === item.id ? "Updating..." : "Update"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
