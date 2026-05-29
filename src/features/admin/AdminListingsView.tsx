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
import { getAdminListings, updateAdminListingApproval } from "@/lib/api/admin";
import type { AdminListing, ApprovalStatus } from "@/types/domain";

const approvalStatuses: ApprovalStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export function AdminListingsView() {
  const { session } = useAuth();
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ApprovalStatus>>({});

  useEffect(() => {
    async function loadListings() {
      if (!session?.accessToken) {
        return;
      }

      try {
        const result = await getAdminListings();
        setListings(result);
        setDrafts(
          Object.fromEntries(
            result.map((item) => [item.id, item.approvalStatus]),
          ),
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load admin listings.";
        setErrorMessage(message);
      }
    }

    void loadListings();
  }, [session?.accessToken]);

  async function handleUpdate(listingId: string) {
    if (!session?.accessToken) {
      return;
    }

    try {
      const updated = await updateAdminListingApproval(
        listingId,
        drafts[listingId],
      );
      setListings((current) =>
        current.map((item) => (item.id === listingId ? updated : item)),
      );
      setSuccessMessage("Listing moderation status updated.");
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update listing moderation status.";
      setErrorMessage(message);
      setSuccessMessage(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Listing moderation
        </Typography>
        <Typography variant="h2">Moderate listings</Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? (
        <Alert severity="success">{successMessage}</Alert>
      ) : null}
      {listings.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            No listings are waiting in the moderation workspace yet.
          </Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {listings.map((listing) => (
          <Paper key={listing.id} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Link href={`/listings/${listing.id}`}>
                <Typography variant="h5">{listing.title}</Typography>
              </Link>
              <Typography color="text.secondary">
                {listing.area}, {listing.city}
              </Typography>
              <Typography color="text.secondary">
                Owner: {listing.owner.fullName} ({listing.owner.email})
              </Typography>
              <Typography color="text.secondary">
                Listing: {listing.listingStatus} / Approval:{" "}
                {listing.approvalStatus}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label="Approval"
                  value={drafts[listing.id] ?? listing.approvalStatus}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [listing.id]: event.target.value as ApprovalStatus,
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
                  onClick={() => handleUpdate(listing.id)}
                >
                  Update
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
