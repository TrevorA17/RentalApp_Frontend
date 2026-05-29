"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSuggestedListings } from "@/lib/api/suggestions";
import type { ListingSuggestion } from "@/types/domain";

export function SuggestedListingsPanel() {
  const { session } = useAuth();
  const [items, setItems] = useState<ListingSuggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadSuggestions() {
      if (!session?.accessToken) {
        setItems([]);
        return;
      }

      try {
        const response = await getSuggestedListings(3);
        setItems(response);
        setErrorMessage(null);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load listing suggestions.";
        setErrorMessage(message);
      }
    }

    void loadSuggestions();
  }, [session?.accessToken]);

  if (!session) {
    return null;
  }

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Chip
            label="Suggested"
            color="secondary"
            sx={{ width: "fit-content" }}
          />
          <Typography variant="h4">Listings worth a closer look</Typography>
          <Typography color="text.secondary">
            These suggestions use your profile, saved items, and inquiry
            activity to surface relevant rental options.
          </Typography>
        </Stack>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {items.length === 0 ? (
          <Typography color="text.secondary">
            Suggestions will appear once you have a bit more browsing or profile
            activity.
          </Typography>
        ) : null}

        <Stack spacing={2}>
          {items.map((item) => (
            <Paper key={item.listing.id} variant="outlined" sx={{ p: 2.5 }}>
              <Stack spacing={1.25}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack spacing={1}>
                    <Link href={`/listings/${item.listing.id}`}>
                      <Typography variant="h6">{item.listing.title}</Typography>
                    </Link>
                    <Typography color="text.secondary">
                      {item.listing.area}, {item.listing.city}
                    </Typography>
                    <Typography color="primary.main" fontWeight={700}>
                      KES {item.listing.rentAmount}
                    </Typography>
                  </Stack>
                  {item.listing.thumbnailUrl ? (
                    <Box
                      component="img"
                      src={item.listing.thumbnailUrl}
                      alt={item.listing.title}
                      sx={{
                        width: 120,
                        height: 84,
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                  ) : null}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {item.reason}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
