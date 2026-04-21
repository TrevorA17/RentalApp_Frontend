"use client";

import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { getRecentModerationActions } from "@/lib/api/admin";
import { AdminModerationAction } from "@/types/domain";

type AdminModerationHistoryViewProps = {
  limit?: number;
};

function formatTargetLabel(action: AdminModerationAction) {
  return action.targetType.toLowerCase().replaceAll("_", " ");
}

function formatStatusTransition(action: AdminModerationAction) {
  return `${action.previousStatus ?? "n/a"} to ${action.newStatus ?? "n/a"}`;
}

export function AdminModerationHistoryView({ limit = 12 }: AdminModerationHistoryViewProps) {
  const [items, setItems] = useState<AdminModerationAction[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadActions() {
      try {
        const result = await getRecentModerationActions(limit);
        setItems(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load moderation history.";
        setErrorMessage(message);
      }
    }

    void loadActions();
  }, [limit]);

  return (
    <Stack spacing={2.5}>
      <Stack spacing={1}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Audit trail
        </Typography>
        <Typography variant="h4">Recent moderation actions</Typography>
        <Typography color="text.secondary">
          Lightweight visibility into the latest admin trust decisions.
        </Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {items.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No moderation actions have been recorded yet.</Typography>
        </Paper>
      ) : null}

      <Stack spacing={1.5}>
        {items.map((item) => (
          <Paper key={item.id} sx={{ p: 2.5 }}>
            <Stack spacing={1}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.5}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={item.actionType} color="secondary" />
                  <Chip label={formatTargetLabel(item)} variant="outlined" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {new Date(item.createdAt).toLocaleString()}
                </Typography>
              </Stack>
              <Typography color="text.secondary">
                Actor: {item.actor.fullName} ({item.actor.email})
              </Typography>
              <Typography color="text.secondary">
                Target ID: {item.targetId}
              </Typography>
              <Typography color="text.secondary">
                Status: {formatStatusTransition(item)}
              </Typography>
              {item.reasonOrNote ? <Typography color="text.secondary">{item.reasonOrNote}</Typography> : null}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
