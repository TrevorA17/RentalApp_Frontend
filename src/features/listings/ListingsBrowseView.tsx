"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { interpretListingSearch } from "@/lib/api/ai";
import { getAmenities, searchListings } from "@/lib/api/listings";
import { getSavedListingIds } from "@/lib/api/savedListings";
import { Amenity, HouseType, InterpretedListingSearch, ListingSummary } from "@/types/domain";
import { PaginatedResponse } from "@/types/api";
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

const sortOptions = [
  { value: "PUBLISHED_AT_DESC", label: "Newest published" },
  { value: "RENT_AMOUNT_ASC", label: "Price: low to high" },
  { value: "RENT_AMOUNT_DESC", label: "Price: high to low" },
  { value: "CREATED_AT_DESC", label: "Newest added" },
] as const;

type ListingSort = (typeof sortOptions)[number]["value"];

const emptyResults: PaginatedResponse<ListingSummary> = {
  items: [],
  page: 0,
  size: 12,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  sort: "PUBLISHED_AT_DESC",
};

export function ListingsBrowseView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth();
  const [results, setResults] = useState<PaginatedResponse<ListingSummary>>(emptyResults);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiSearchInput, setAiSearchInput] = useState("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<InterpretedListingSearch | null>(null);

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [area, setArea] = useState(searchParams.get("area") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "");
  const [houseType, setHouseType] = useState(searchParams.get("houseType") ?? "");
  const [selectedAmenity, setSelectedAmenity] = useState(searchParams.get("amenities") ?? "");
  const [sort, setSort] = useState<ListingSort>((searchParams.get("sort") as ListingSort) || "PUBLISHED_AT_DESC");

  useEffect(() => {
    setCity(searchParams.get("city") ?? "");
    setArea(searchParams.get("area") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setBedrooms(searchParams.get("bedrooms") ?? "");
    setHouseType(searchParams.get("houseType") ?? "");
    setSelectedAmenity(searchParams.get("amenities") ?? "");
    setSort(((searchParams.get("sort") as ListingSort) || "PUBLISHED_AT_DESC"));
  }, [searchParams]);

  useEffect(() => {
    async function loadBrowseData() {
      try {
        setErrorMessage(null);
        const pageParam = Number(searchParams.get("page") ?? "0");
        const sizeParam = Number(searchParams.get("size") ?? "12");
        const [listingResults, amenityOptions] = await Promise.all([
          searchListings({
            city: searchParams.get("city") || undefined,
            area: searchParams.get("area") || undefined,
            maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
            bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
            houseType: searchParams.get("houseType") || undefined,
            amenities: searchParams.get("amenities") ? [searchParams.get("amenities") as string] : undefined,
            page: Number.isNaN(pageParam) ? 0 : pageParam,
            size: Number.isNaN(sizeParam) ? 12 : sizeParam,
            sort: ((searchParams.get("sort") as ListingSort) || "PUBLISHED_AT_DESC"),
          }),
          getAmenities(),
        ]);
        setResults(listingResults);
        setAmenities(amenityOptions);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load listings.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    }

    setIsSearching(true);
    void loadBrowseData();
  }, [searchParams]);

  useEffect(() => {
    async function loadSavedIds() {
      if (!session?.accessToken) {
        setSavedListingIds([]);
        return;
      }

      try {
        const ids = await getSavedListingIds();
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

  function updateQuery(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.replace(`/listings${query ? `?${query}` : ""}`);
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSearching(true);
    updateQuery({
      city: city || undefined,
      area: area || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms || undefined,
      houseType: houseType || undefined,
      amenities: selectedAmenity || undefined,
      sort,
      page: "0",
      size: String(results.size || 12),
    });
  }

  async function handleInterpretSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!aiSearchInput.trim()) {
      return;
    }

    setErrorMessage(null);
    setAiInterpretation(null);
    setIsInterpreting(true);

    try {
      const interpreted = await interpretListingSearch(aiSearchInput.trim());
      setAiInterpretation(interpreted);

      updateQuery({
        city: interpreted.filters.city || undefined,
        area: interpreted.filters.area || undefined,
        maxPrice: interpreted.filters.maxPrice ? String(interpreted.filters.maxPrice) : undefined,
        bedrooms: interpreted.filters.bedrooms ? String(interpreted.filters.bedrooms) : undefined,
        houseType: interpreted.filters.houseType || undefined,
        amenities: interpreted.filters.amenities[0]?.id || undefined,
        sort,
        page: "0",
        size: String(results.size || 12),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to interpret search request.";
      setErrorMessage(message);
    } finally {
      setIsInterpreting(false);
    }
  }

  function handleReset() {
    setErrorMessage(null);
    setIsSearching(true);
    updateQuery({
      city: undefined,
      area: undefined,
      maxPrice: undefined,
      bedrooms: undefined,
      houseType: undefined,
      amenities: undefined,
      sort: "PUBLISHED_AT_DESC",
      page: "0",
      size: "12",
    });
  }

  function handleSortChange(nextSort: ListingSort) {
    setSort(nextSort);
    setIsSearching(true);
    updateQuery({
      sort: nextSort,
      page: "0",
    });
  }

  function handlePageChange(nextPage: number) {
    setIsSearching(true);
    updateQuery({
      page: String(nextPage - 1),
    });
  }

  function formatEnumLabel(value: string) {
    return value
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  const activeFilterLabels = useMemo(
    () =>
      [
        city ? `City: ${city}` : null,
        area ? `Area: ${area}` : null,
        maxPrice ? `Max KES ${maxPrice}` : null,
        bedrooms ? `${bedrooms} bedroom${bedrooms === "1" ? "" : "s"}` : null,
        houseType ? formatEnumLabel(houseType) : null,
        selectedAmenity ? amenities.find((item) => item.id === selectedAmenity)?.name ?? null : null,
      ].filter(Boolean) as string[],
    [amenities, area, bedrooms, city, houseType, maxPrice, selectedAmenity],
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1.5}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Module 4
        </Typography>
        <Typography variant="h2">Browse listings</Typography>
        <Typography color="text.secondary">
          Explore live rental listings with practical filters, sorting, and paginated results built for a real marketplace flow.
        </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack component="form" spacing={1.5} onSubmit={handleInterpretSearch} sx={{ mb: 3 }}>
          <Typography fontWeight={700}>Describe what you want</Typography>
          <Typography color="text.secondary">
            Try a natural-language request like “2 bedroom in Kilimani under 50k with parking”. We will translate it into the structured filters below.
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              label="Natural-language housing request"
              value={aiSearchInput}
              onChange={(event) => setAiSearchInput(event.target.value)}
              fullWidth
            />
            <Button type="submit" variant="outlined" disabled={isInterpreting}>
              {isInterpreting ? "Interpreting..." : "Use AI to fill filters"}
            </Button>
          </Stack>
          {aiInterpretation ? (
            <Alert severity={aiInterpretation.interpreted ? "success" : "info"}>
              {aiInterpretation.interpreted
                ? `Matched ${aiInterpretation.matchedSignals.join(", ")} using ${aiInterpretation.provider}.`
                : "No strong structured filters were extracted. Keep using the manual search controls."}
              {aiInterpretation.notes.length > 0 ? ` ${aiInterpretation.notes.join(" ")}` : ""}
            </Alert>
          ) : null}
        </Stack>
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Sort"
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as ListingSort)}
                fullWidth
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {activeFilterLabels.length > 0 ? (
                  activeFilterLabels.map((label) => <Chip key={label} label={label} color="secondary" />)
                ) : (
                  <Chip label="No filters applied" variant="outlined" />
                )}
              </Stack>
            </Grid>
          </Grid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button type="submit" variant="contained" disabled={isSearching}>
              Search listings
            </Button>
            <Button type="button" variant="outlined" onClick={handleReset} disabled={isSearching}>
              Reset filters
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {isLoading || isSearching ? <Alert severity="info">Loading listings...</Alert> : null}

      {!isLoading && !isSearching ? (
        <Paper sx={{ p: 2.5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Typography color="text.secondary">
              {results.totalElements} listing{results.totalElements === 1 ? "" : "s"} found
            </Typography>
            <Typography color="text.secondary">
              Page {results.totalPages === 0 ? 0 : results.page + 1} of {results.totalPages}
            </Typography>
          </Stack>
        </Paper>
      ) : null}

      {!isLoading && !isSearching && results.items.length === 0 ? (
        <Paper sx={{ p: 4 }}>
          <Stack spacing={1}>
            <Typography variant="h5">No listings match these filters</Typography>
            <Typography color="text.secondary">
              Try broadening the location, price, or property details and search again.
            </Typography>
          </Stack>
        </Paper>
      ) : null}

      <Grid container spacing={3}>
        {results.items.map((listing) => (
          <Grid key={listing.id} size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                height: "100%",
                overflow: "hidden",
              }}
            >
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
                    {listing.bedrooms} bed - {listing.bathrooms} bath - {formatEnumLabel(listing.houseType)}
                  </Typography>
                  <Typography color="text.secondary">
                    {listing.area}, {listing.city}
                  </Typography>
                  <Typography color="text.secondary">
                    Amenities: {listing.amenities.length > 0 ? listing.amenities.map((amenity) => amenity.name).join(", ") : "None listed"}
                  </Typography>
                  <Typography color="text.secondary">
                    {formatEnumLabel(listing.availabilityStatus)}{listing.furnished ? " - Furnished" : " - Unfurnished"}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {!isLoading && !isSearching && results.totalPages > 1 ? (
        <Stack alignItems="center">
          <Pagination
            count={results.totalPages}
            page={results.page + 1}
            onChange={(_, page) => handlePageChange(page)}
            color="secondary"
            shape="rounded"
          />
        </Stack>
      ) : null}
    </Stack>
  );
}
