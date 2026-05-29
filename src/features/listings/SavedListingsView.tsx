"use client";

import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { useSavedListings } from "@/hooks/useSavedListings";
import { SaveListingButton } from "./SaveListingButton";

export function SavedListingsView() {
  const { session } = useAuth();
  const { savedListings, error, refetch } = useSavedListings(
    Boolean(session?.accessToken),
  );

  function handleSavedChange(_listingId: string, saved: boolean) {
    if (!saved) {
      void refetch();
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Renter shortlist
        </Typography>
        <Typography variant="h2">Saved listings</Typography>
        <Typography color="text.secondary">
          Shortlist published listings here before you start contacting owners
          and agents.
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {savedListings.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            You have not saved any listings yet. Browse public listings and add
            a few to your shortlist.
          </Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {savedListings.map((listing) => (
          <Paper key={listing.id} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Stack spacing={1}>
                  <Link href={`/listings/${listing.id}`}>
                    <Typography variant="h5">{listing.title}</Typography>
                  </Link>
                  <Typography variant="h6" color="primary.main">
                    KES {listing.rentAmount}
                  </Typography>
                  <Typography color="text.secondary">
                    {listing.bedrooms} bed - {listing.bathrooms} bath -{" "}
                    {listing.houseType}
                  </Typography>
                  <Typography color="text.secondary">
                    {listing.area}, {listing.city}
                  </Typography>
                </Stack>
                <Stack alignItems={{ xs: "stretch", sm: "flex-end" }}>
                  <SaveListingButton
                    listingId={listing.id}
                    onSavedChange={(saved) =>
                      handleSavedChange(listing.id, saved)
                    }
                  />
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
