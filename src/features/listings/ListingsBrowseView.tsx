"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListingCard } from "@/components/ui/ListingCard";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAmenities } from "@/hooks/useAmenities";
import { useSavedListingIds } from "@/hooks/useSavedListings";
import { interpretListingSearch } from "@/lib/api/ai";
import { searchListings } from "@/lib/api/listings";
import type { PaginatedResponse } from "@/types/api";
import type {
  HouseType,
  InterpretedListingSearch,
  ListingSummary,
} from "@/types/domain";
import { SaveListingButton } from "./SaveListingButton";

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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
  { value: "PUBLISHED_AT_DESC", label: "Newest" },
  { value: "RENT_AMOUNT_ASC", label: "Price: low to high" },
  { value: "RENT_AMOUNT_DESC", label: "Price: high to low" },
  { value: "CREATED_AT_DESC", label: "Recently added" },
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
  const [results, setResults] =
    useState<PaginatedResponse<ListingSummary>>(emptyResults);
  const { amenities } = useAmenities();
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiSearchInput, setAiSearchInput] = useState("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [aiInterpretation, setAiInterpretation] =
    useState<InterpretedListingSearch | null>(null);

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [area, setArea] = useState(searchParams.get("area") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") ?? "");
  const [houseType, setHouseType] = useState(
    searchParams.get("houseType") ?? "",
  );
  const [selectedAmenity, setSelectedAmenity] = useState(
    searchParams.get("amenities") ?? "",
  );
  const [sort, setSort] = useState<ListingSort>(
    (searchParams.get("sort") as ListingSort) || "PUBLISHED_AT_DESC",
  );

  useEffect(() => {
    setCity(searchParams.get("city") ?? "");
    setArea(searchParams.get("area") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setBedrooms(searchParams.get("bedrooms") ?? "");
    setHouseType(searchParams.get("houseType") ?? "");
    setSelectedAmenity(searchParams.get("amenities") ?? "");
    setSort((searchParams.get("sort") as ListingSort) || "PUBLISHED_AT_DESC");
  }, [searchParams]);

  useEffect(() => {
    async function loadBrowseData() {
      try {
        setErrorMessage(null);
        const pageParam = Number(searchParams.get("page") ?? "0");
        const sizeParam = Number(searchParams.get("size") ?? "12");
        const listingResults = await searchListings({
          city: searchParams.get("city") || undefined,
          area: searchParams.get("area") || undefined,
          maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined,
          bedrooms: searchParams.get("bedrooms")
            ? Number(searchParams.get("bedrooms"))
            : undefined,
          houseType: searchParams.get("houseType") || undefined,
          amenities: searchParams.get("amenities")
            ? [searchParams.get("amenities") as string]
            : undefined,
          page: Number.isNaN(pageParam) ? 0 : pageParam,
          size: Number.isNaN(sizeParam) ? 12 : sizeParam,
          sort:
            (searchParams.get("sort") as ListingSort) || "PUBLISHED_AT_DESC",
        });
        setResults(listingResults);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load listings.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    }

    setIsSearching(true);
    void loadBrowseData();
  }, [searchParams]);

  const { savedIds } = useSavedListingIds(Boolean(session?.accessToken));

  useEffect(() => {
    setSavedListingIds(savedIds);
  }, [savedIds]);

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

  function handleSearch(event: FormEvent<HTMLFormElement>) {
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
    if (!aiSearchInput.trim()) return;

    setErrorMessage(null);
    setAiInterpretation(null);
    setIsInterpreting(true);

    try {
      const interpreted = await interpretListingSearch(aiSearchInput.trim());
      setAiInterpretation(interpreted);

      updateQuery({
        city: interpreted.filters.city || undefined,
        area: interpreted.filters.area || undefined,
        maxPrice: interpreted.filters.maxPrice
          ? String(interpreted.filters.maxPrice)
          : undefined,
        bedrooms: interpreted.filters.bedrooms
          ? String(interpreted.filters.bedrooms)
          : undefined,
        houseType: interpreted.filters.houseType || undefined,
        amenities: interpreted.filters.amenities[0]?.id || undefined,
        sort,
        page: "0",
        size: String(results.size || 12),
      });
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
    updateQuery({ sort: nextSort, page: "0" });
  }

  function handlePageChange(nextPage: number) {
    setIsSearching(true);
    updateQuery({ page: String(nextPage - 1) });
  }

  const activeFilterLabels = useMemo(
    () =>
      [
        city ? `City: ${city}` : null,
        area ? `Area: ${area}` : null,
        maxPrice ? `Max KES ${maxPrice}` : null,
        bedrooms ? `${bedrooms} bedroom${bedrooms === "1" ? "" : "s"}` : null,
        houseType ? formatEnumLabel(houseType) : null,
        selectedAmenity
          ? (amenities.find((item) => item.id === selectedAmenity)?.name ??
            null)
          : null,
      ].filter(Boolean) as string[],
    [amenities, area, bedrooms, city, houseType, maxPrice, selectedAmenity],
  );

  const hasActiveFilters = activeFilterLabels.length > 0;
  const showLoading = isLoading || isSearching;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersVisible = !isMobile || filtersOpen;

  return (
    <Box>
      {/* AI search row */}
      <Paper
        component="form"
        onSubmit={handleInterpretSearch}
        sx={{
          p: 1,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderColor: "primary.light",
        }}
      >
        <Box sx={{ pl: 1.5, color: "primary.main", display: "flex" }}>
          <Sparkles size={18} />
        </Box>
        <TextField
          placeholder='Try "2-bed in Kilimani under 50k with parking"'
          value={aiSearchInput}
          onChange={(event) => setAiSearchInput(event.target.value)}
          fullWidth
          variant="standard"
          slotProps={{ input: { disableUnderline: true } }}
          sx={{
            "& .MuiInputBase-root": { backgroundColor: "transparent" },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={isInterpreting || !aiSearchInput.trim()}
          sx={{ flexShrink: 0 }}
        >
          {isInterpreting ? "Interpreting…" : "Ask AI"}
        </Button>
      </Paper>

      {aiInterpretation ? (
        <Alert
          severity={aiInterpretation.interpreted ? "success" : "info"}
          sx={{ mb: 2 }}
          onClose={() => setAiInterpretation(null)}
        >
          {aiInterpretation.interpreted
            ? `Matched ${aiInterpretation.matchedSignals.join(", ")} using ${aiInterpretation.provider}.`
            : "No strong filters extracted — use the manual controls below."}
        </Alert>
      ) : null}

      {/* Filters toggle (mobile only) */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ display: { md: "none" }, mb: 1.5 }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<SlidersHorizontal size={16} />}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          Filters{hasActiveFilters ? ` (${activeFilterLabels.length})` : ""}
        </Button>
      </Stack>

      {/* Filter bar */}
      <Collapse in={filtersVisible}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            p: 2,
            mb: 2,
            position: "sticky",
            top: { md: 64 },
            zIndex: 5,
          }}
        >
          <Grid container spacing={1.5} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
              <TextField
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
              <TextField
                placeholder="Max KES"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3, md: 1 }}>
              <TextField
                placeholder="Beds"
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                select
                value={houseType}
                onChange={(e) => setHouseType(e.target.value)}
                fullWidth
                size="small"
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">
                  <em>Any type</em>
                </MenuItem>
                {houseTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {formatEnumLabel(option)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack direction="row" spacing={1}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<SearchIcon size={16} />}
                  disabled={isSearching}
                >
                  Search
                </Button>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleReset}
                    disabled={isSearching}
                  >
                    Clear
                  </Button>
                ) : null}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Results header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Typography variant="h6" sx={{ mr: 1 }}>
            {results.totalElements} rental
            {results.totalElements === 1 ? "" : "s"}
          </Typography>
          {activeFilterLabels.map((label) => (
            <Chip key={label} label={label} size="small" />
          ))}
        </Stack>
        <TextField
          select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as ListingSort)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              Sort: {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}

      {!showLoading && results.items.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No listings match these filters"
          description="Try broadening the location, price, or property details."
          action={
            hasActiveFilters ? (
              <Button onClick={handleReset} variant="outlined">
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : null}

      {/* Card grid */}
      <Grid container spacing={2.5}>
        {results.items.map((listing) => (
          <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ListingCard
              listing={listing}
              renderActions={
                session
                  ? () => (
                      <SaveListingButton
                        key={`${listing.id}-${savedListingIds.includes(listing.id) ? "saved" : "unsaved"}`}
                        listingId={listing.id}
                        iconOnly
                        onSavedChange={(saved) =>
                          handleSavedChange(listing.id, saved)
                        }
                      />
                    )
                  : undefined
              }
            />
          </Grid>
        ))}
      </Grid>

      {!showLoading && results.totalPages > 1 ? (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={results.totalPages}
            page={results.page + 1}
            onChange={(_, page) => handlePageChange(page)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      ) : null}
    </Box>
  );
}
