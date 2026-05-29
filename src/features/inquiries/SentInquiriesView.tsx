"use client";

import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { useSentInquiries } from "@/hooks/useInquiries";

export function SentInquiriesView() {
  const { session } = useAuth();
  const { inquiries, error } = useSentInquiries(Boolean(session?.accessToken));

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Inquiry tracking
        </Typography>
        <Typography variant="h2">Sent inquiries</Typography>
        <Typography color="text.secondary">
          Track the listings you have contacted and monitor whether the owner
          has responded.
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {inquiries.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            You have not sent any inquiries yet.
          </Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {inquiries.map((inquiry) => (
          <Paper key={inquiry.id} sx={{ p: 3 }}>
            <Stack spacing={1.25}>
              <Link href={`/listings/${inquiry.listingId}`}>
                <Typography variant="h5">{inquiry.listingTitle}</Typography>
              </Link>
              <Typography color="primary.main" fontWeight={700}>
                KES {inquiry.listingRentAmount}
              </Typography>
              <Typography color="text.secondary">
                To: {inquiry.recipient.fullName} ({inquiry.recipient.role})
              </Typography>
              <Typography color="text.secondary">
                Status: {inquiry.status}
              </Typography>
              <Typography color="text.secondary">{inquiry.message}</Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
