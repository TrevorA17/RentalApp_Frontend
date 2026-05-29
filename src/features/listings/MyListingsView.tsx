"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListingCard } from "@/components/ui/ListingCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/features/auth/AuthProvider";
import { useMyListings } from "@/hooks/useMyListings";

export function MyListingsView() {
  const { session } = useAuth();
  const { listings, error } = useMyListings(Boolean(session));

  if (!session) {
    return null;
  }

  if (session.user.role !== "AGENT" && session.user.role !== "LANDLORD") {
    return (
      <Alert severity="warning">
        Only agent and landlord accounts can manage listings.
      </Alert>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My listings"
        subtitle="Manage draft and published rental listings."
        actions={
          <Button
            component={Link}
            href="/my-listings/new"
            variant="contained"
            startIcon={<Plus size={16} />}
          >
            New listing
          </Button>
        }
      />

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {listings.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No listings yet"
          description="Create your first rental listing to get started."
          action={
            <Button
              component={Link}
              href="/my-listings/new"
              variant="contained"
              startIcon={<Plus size={16} />}
            >
              Create listing
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2.5}>
          {listings.map((listing) => (
            <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Stack spacing={1.5}>
                <ListingCard listing={listing} />
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={listing.listingStatus}
                    size="small"
                    color={
                      listing.listingStatus === "PUBLISHED"
                        ? "primary"
                        : "default"
                    }
                  />
                  <Chip
                    label={listing.approvalStatus}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={Link}
                    href={`/my-listings/${listing.id}/edit`}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button
                    component={Link}
                    href={`/listings/${listing.id}`}
                    variant="contained"
                    size="small"
                    fullWidth
                  >
                    View
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
