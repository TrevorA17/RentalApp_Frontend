"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getReceivedInquiries, updateInquiryStatus } from "@/lib/api/inquiries";
import { Inquiry, InquiryStatus } from "@/types/domain";

const inquiryStatuses: InquiryStatus[] = ["NEW", "CONTACTED", "CLOSED"];

export function ReceivedInquiriesView() {
  const { session } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, InquiryStatus>>({});

  useEffect(() => {
    async function loadInquiries() {
      if (!session?.accessToken) {
        setInquiries([]);
        return;
      }

      try {
        const results = await getReceivedInquiries(session.accessToken);
        setInquiries(results);
        setStatusDrafts(
          Object.fromEntries(results.map((inquiry) => [inquiry.id, inquiry.status])),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load inquiries.";
        setErrorMessage(message);
      }
    }

    void loadInquiries();
  }, [session?.accessToken]);

  async function handleUpdateStatus(inquiryId: string) {
    if (!session?.accessToken) {
      return;
    }

    try {
      const updated = await updateInquiryStatus(
        session.accessToken,
        inquiryId,
        statusDrafts[inquiryId],
      );
      setInquiries((current) =>
        current.map((inquiry) => (inquiry.id === inquiryId ? updated : inquiry)),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update inquiry status.";
      setErrorMessage(message);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Module 6
        </Typography>
        <Typography variant="h2">Received inquiries</Typography>
        <Typography color="text.secondary">
          Review incoming renter interest and update each inquiry as you respond.
        </Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {inquiries.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No one has contacted your listings yet.</Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {inquiries.map((inquiry) => (
          <Paper key={inquiry.id} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Link href={`/listings/${inquiry.listingId}`}>
                <Typography variant="h5">{inquiry.listingTitle}</Typography>
              </Link>
              <Typography color="primary.main" fontWeight={700}>
                KES {inquiry.listingRentAmount}
              </Typography>
              <Typography color="text.secondary">
                From: {inquiry.sender.fullName} ({inquiry.sender.role}) - {inquiry.sender.email}
              </Typography>
              <Typography color="text.secondary">{inquiry.message}</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
                <TextField
                  select
                  label="Status"
                  value={statusDrafts[inquiry.id] ?? inquiry.status}
                  onChange={(event) =>
                    setStatusDrafts((current) => ({
                      ...current,
                      [inquiry.id]: event.target.value as InquiryStatus,
                    }))
                  }
                  sx={{ minWidth: 220 }}
                >
                  {inquiryStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="contained" onClick={() => handleUpdateStatus(inquiry.id)}>
                  Update status
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
