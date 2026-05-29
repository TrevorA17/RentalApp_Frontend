"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/features/auth/AuthProvider";
import { useReceivedInquiries } from "@/hooks/useInquiries";
import { extractApiError } from "@/lib/api/client";
import { updateInquiryStatus } from "@/lib/api/inquiries";
import type { InquiryStatus } from "@/types/domain";

const inquiryStatuses: InquiryStatus[] = ["NEW", "CONTACTED", "CLOSED"];

export function ReceivedInquiriesView() {
  const { session } = useAuth();
  const { inquiries, error, refetch } = useReceivedInquiries(
    Boolean(session?.accessToken),
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<
    Record<string, InquiryStatus>
  >({});

  useEffect(() => {
    setStatusDrafts(
      Object.fromEntries(
        inquiries.map((inquiry) => [inquiry.id, inquiry.status]),
      ),
    );
  }, [inquiries]);

  async function handleUpdateStatus(inquiryId: string) {
    if (!session?.accessToken) return;
    try {
      await updateInquiryStatus(inquiryId, statusDrafts[inquiryId]);
      await refetch();
    } catch (err) {
      setMutationError(extractApiError(err));
    }
  }

  const errorMessage = error ?? mutationError;

  return (
    <Box>
      <PageHeader
        title="Received inquiries"
        subtitle="Review incoming renter interest and update each inquiry as you respond."
      />

      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}

      {inquiries.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No inquiries yet"
          description="When renters contact your listings, the conversations will appear here."
        />
      ) : (
        <Stack spacing={1.5}>
          {inquiries.map((inquiry) => (
            <Paper key={inquiry.id} sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      component={Link}
                      href={`/listings/${inquiry.listingId}`}
                      variant="h5"
                      sx={{
                        textDecoration: "none",
                        color: "text.primary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {inquiry.listingTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From {inquiry.sender.fullName} ({inquiry.sender.role}) ·{" "}
                      {inquiry.sender.email}
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {inquiry.message}
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <TextField
                    select
                    size="small"
                    label="Status"
                    value={statusDrafts[inquiry.id] ?? inquiry.status}
                    onChange={(event) =>
                      setStatusDrafts((current) => ({
                        ...current,
                        [inquiry.id]: event.target.value as InquiryStatus,
                      }))
                    }
                    sx={{ minWidth: 180 }}
                  >
                    {inquiryStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleUpdateStatus(inquiry.id)}
                  >
                    Update
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
