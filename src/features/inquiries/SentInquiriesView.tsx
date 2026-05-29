"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Send } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/features/auth/AuthProvider";
import { useSentInquiries } from "@/hooks/useInquiries";

const STATUS_COLOR: Record<
  string,
  "default" | "primary" | "success" | "warning"
> = {
  NEW: "warning",
  CONTACTED: "primary",
  CLOSED: "default",
};

export function SentInquiriesView() {
  const { session } = useAuth();
  const { inquiries, error } = useSentInquiries(Boolean(session?.accessToken));

  return (
    <Box>
      <PageHeader
        title="Sent inquiries"
        subtitle="Track the listings you have contacted and monitor whether the owner has responded."
      />

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {inquiries.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No inquiries sent yet"
          description="When you contact an owner from a listing, the conversation will appear here."
        />
      ) : (
        <Stack spacing={1.5}>
          {inquiries.map((inquiry) => (
            <Paper key={inquiry.id} sx={{ p: 2.5 }}>
              <Stack spacing={1.25}>
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
                      KES {inquiry.listingRentAmount.toLocaleString()} · To{" "}
                      {inquiry.recipient.fullName} ({inquiry.recipient.role})
                    </Typography>
                  </Box>
                  <Chip
                    label={inquiry.status}
                    size="small"
                    color={STATUS_COLOR[inquiry.status] ?? "default"}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {inquiry.message}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
