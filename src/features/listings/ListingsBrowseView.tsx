"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getAmenities, searchListings } from "@/lib/api/listings";
import { getSavedListingIds } from "@/lib/api/savedListings";
import { Amenity, HouseType, ListingSummary } from "@/types/domain";
import { SaveListingButton } from "./SaveListingButton";

const houseTypes: HouseType[] = [
  "APARTMENT",
  "BEDSITTER",
  "STUDIO",
  "MAISONETTE",
  "BUNGALOW",
  "HOUSE",
  "TOWNHOUSE",
];

export function ListingsBrowseView() {
  const { session } = useAuth();
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [houseType, setHouseType] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");

  useEffect(() => {
    async function loadInitial() {
      try {
        const [listingResults, amenityOptions] = await Promise.all([
          searchListings(),
          getAmenities(),
        ]);
        setListings(listingResults);
        setAmenities(amenityOptions);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load listings.";
        setErrorMessage(message);
      }
    }

    void loadInitial();
  }, []);

  useEffect(() => {
    async function loadSavedIds() {
      if (!session?.accessToken) {
        setSavedListingIds([]);
        return;
      }

      try {
        const ids = await getSavedListingIds(session.accessToken);
        setSavedListingIds(ids);
      } catch {
        setSavedListingIds([]);
      }
    }

    void loadSavedIds();
  }, [session?.accessToken]);

  function handleSavedChange(listingId: string, saved: boolean) {
    setSavedListingIds((current) => {
      if (saved) {
        return current.includes(listingId) ? current : [...current, listingId];
      }

      return current.filter((id) => id !== listingId);
    });
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const results = await searchListings({
        city: city || undefined,
        area: area || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        houseType: houseType || undefined,
        amenities: selectedAmenity ? [selectedAmenity] : undefined,
      });
      setListings(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to search listings.";
      setErrorMessage(message);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Module 4
        </Typography>
        <Typography variant="h2">Browse listings</Typography>
        <Typography color="text.secondary">
          Public discovery is now backed by real published listing data and core filters.
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack component="form" spacing={2} onSubmit={handleSearch}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField label="Area" value={area} onChange={(e) => setArea(e.target.value)} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField label="Max price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField label="Bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField select SelectProps={{ native: true }} label="House type" value={houseType} onChange={(e) => setHouseType(e.target.value)} fullWidth>
                <option value="">Any</option>
                {houseTypes.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField select SelectProps={{ native: true }} label="Amenity" value={selectedAmenity} onChange={(e) => setSelectedAmenity(e.target.value)} fullWidth>
                <option value="">Any</option>
                {amenities.map((amenity) => (
                  <option key={amenity.id} value={amenity.id}>{amenity.name}</option>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="City" />
                <Chip label="Area" />
                <Chip label="Price" />
                <Chip label="Bedrooms" />
                <Chip label="House Type" />
                <Chip label="Amenities" />
              </Stack>
            </Grid>
          </Grid>

          <Stack direction="row">
            <Button type="submit" variant="contained">
              Search listings
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid key={listing.id} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, backgroundColor: "background.paper", height: "100%" }}>
              <Stack spacing={2}>
                {listing.thumbnailUrl ? (
                  <Box
                    component="img"
                    src={listing.thumbnailUrl}
                    alt={listing.title}
                    sx={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 3 }}
                  />
                ) : null}
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
                  <Link href={`/listings/${listing.id}`}>
                    <Typography variant="h5">{listing.title}</Typography>
                  </Link>
                  <SaveListingButton
                    key={`${listing.id}-${savedListingIds.includes(listing.id) ? "saved" : "unsaved"}`}
                    listingId={listing.id}
                    variant={savedListingIds.includes(listing.id) ? "contained" : "outlined"}
                    onSavedChange={(saved) => handleSavedChange(listing.id, saved)}
                  />
                </Stack>
                <Stack spacing={1.5}>
                  <Typography variant="h6" color="primary.main">
                    KES {listing.rentAmount}
                  </Typography>
                  <Typography color="text.secondary">
                    {listing.bedrooms} bed - {listing.bathrooms} bath - {listing.houseType}
                  </Typography>
                  <Typography color="text.secondary">
                    {listing.area}, {listing.city}
                  </Typography>
                  <Typography color="text.secondary">
                    Amenities: {listing.amenities.map((amenity) => amenity.name).join(", ")}
                  </Typography>
                  <Typography color="text.secondary">
                    Media items: {listing.media.length}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
