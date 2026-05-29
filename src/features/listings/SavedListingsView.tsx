"use client";

import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSavedListings } from "@/lib/api/savedListings";
import type { ListingSummary } from "@/types/domain";
import { SaveListingButton } from "./SaveListingButton";

export function SavedListingsView() {
  const { session } = useAuth();
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedListings() {
      if (!session?.accessToken) {
        setListings([]);
        return;
      }

      try {
        const results = await getSavedListings();
        setListings(results);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load saved listings.";
        setErrorMessage(message);
      }
    }

    void loadSavedListings();
  }, [session?.accessToken]);

  function handleSavedChange(listingId: string, saved: boolean) {
    if (!saved) {
      setListings((current) =>
        current.filter((listing) => listing.id !== listingId),
      );
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

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {listings.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            You have not saved any listings yet. Browse public listings and add
            a few to your shortlist.
          </Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {listings.map((listing) => (
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
