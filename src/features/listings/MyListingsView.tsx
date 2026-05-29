"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
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
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Chip
            label="Listing workspace"
            color="secondary"
            sx={{ width: "fit-content" }}
          />
          <Typography variant="h3">My listings</Typography>
          <Typography color="text.secondary">
            Manage draft and published rental listings from one place.
          </Typography>
          <Stack direction="row">
            <Button
              component={Link}
              href="/my-listings/new"
              variant="contained"
            >
              Create listing
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {listings.map((listing) => (
        <Paper key={listing.id} sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            {listing.thumbnailUrl ? (
              <Box
                component="img"
                src={listing.thumbnailUrl}
                alt={listing.title}
                sx={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 3,
                }}
              />
            ) : null}
            <Typography variant="h5">{listing.title}</Typography>
            <Typography color="text.secondary">
              {listing.city}, {listing.area} - KES {listing.rentAmount}
            </Typography>
            <Typography color="text.secondary">
              {listing.listingStatus} / {listing.approvalStatus}
            </Typography>
            <Typography color="text.secondary">
              Media items: {listing.media.length}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                component={Link}
                href={`/my-listings/${listing.id}/edit`}
                variant="outlined"
              >
                Edit
              </Button>
              <Button
                component={Link}
                href={`/listings/${listing.id}`}
                variant="contained"
              >
                View
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
