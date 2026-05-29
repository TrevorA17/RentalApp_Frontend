"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Heart } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListingCard } from "@/components/ui/ListingCard";
import { PageHeader } from "@/components/ui/PageHeader";
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
    <Box>
      <PageHeader
        title="Saved listings"
        subtitle="Shortlist published listings before you start contacting owners and agents."
      />

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {savedListings.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved listings yet"
          description="Browse public listings and tap the heart to shortlist them here."
          action={
            <Button component={Link} href="/listings" variant="contained">
              Browse rentals
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2.5}>
          {savedListings.map((listing) => (
            <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ListingCard
                listing={listing}
                renderActions={() => (
                  <SaveListingButton
                    listingId={listing.id}
                    iconOnly
                    onSavedChange={(saved) =>
                      handleSavedChange(listing.id, saved)
                    }
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
