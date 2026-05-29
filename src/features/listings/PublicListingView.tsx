"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BadgeCheck, Bath, Bed, Flag as FlagIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InquiryComposer } from "@/features/inquiries/InquiryComposer";
import { ReportComposer } from "@/features/reports/ReportComposer";
import type { ListingDetail } from "@/types/domain";
import { SaveListingButton } from "./SaveListingButton";

type PublicListingViewProps = {
  listing: ListingDetail;
};

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatKes(value?: number) {
  if (value === undefined || value === null) return "—";
  return `KES ${Number(value).toLocaleString()}`;
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PublicListingView({ listing }: PublicListingViewProps) {
  const images = listing.media.filter((m) => m.mediaType === "IMAGE");
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];
  const [showReport, setShowReport] = useState(false);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Gallery */}
          {active ? (
            <Stack spacing={1.5}>
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 10",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "grey.100",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  component="img"
                  src={active.mediaUrl}
                  alt={active.caption || listing.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
              {images.length > 1 ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ overflowX: "auto", pb: 0.5 }}
                >
                  {images.map((media, index) => (
                    <Box
                      key={media.id}
                      component="button"
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      sx={{
                        width: 96,
                        height: 64,
                        flexShrink: 0,
                        border: index === activeIndex ? 2 : 1,
                        borderStyle: "solid",
                        borderColor:
                          index === activeIndex ? "primary.main" : "divider",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        cursor: "pointer",
                        p: 0,
                        background: "transparent",
                      }}
                    >
                      <Box
                        component="img"
                        src={media.mediaUrl}
                        alt=""
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : null}
            </Stack>
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: 2,
                bgcolor: "grey.100",
                display: "grid",
                placeItems: "center",
                color: "text.disabled",
              }}
            >
              No photos yet
            </Box>
          )}

          {/* Title row */}
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={formatEnumLabel(listing.houseType)} size="small" />
              <Chip
                label={formatEnumLabel(listing.availabilityStatus)}
                size="small"
                variant="outlined"
              />
              {listing.furnished ? (
                <Chip label="Furnished" size="small" variant="outlined" />
              ) : null}
            </Stack>
            <Typography variant="h2">{listing.title}</Typography>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              color="text.secondary"
            >
              <MapPin size={16} />
              <Typography>
                {listing.area}, {listing.city}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              color="text.secondary"
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Bed size={18} />
                <Typography>
                  {listing.bedrooms}{" "}
                  {listing.bedrooms === 1 ? "bedroom" : "bedrooms"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Bath size={18} />
                <Typography>
                  {listing.bathrooms}{" "}
                  {listing.bathrooms === 1 ? "bathroom" : "bathrooms"}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="h4">About this rental</Typography>
              <Typography
                color="text.secondary"
                sx={{ whiteSpace: "pre-line" }}
              >
                {listing.description}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="h4">Details</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Monthly rent
                  </Typography>
                  <Typography fontWeight={600}>
                    {formatKes(listing.rentAmount)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Deposit
                  </Typography>
                  <Typography fontWeight={600}>
                    {formatKes(listing.depositAmount)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Agent fee
                  </Typography>
                  <Typography fontWeight={600}>
                    {formatKes(listing.agentFeeAmount)}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>

            {listing.amenities.length > 0 ? (
              <>
                <Divider />
                <Stack spacing={1.5}>
                  <Typography variant="h4">Amenities</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {listing.amenities.map((amenity) => (
                      <Chip
                        key={amenity.id}
                        label={amenity.name}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Stack>
              </>
            ) : null}
          </Stack>
        </Grid>

        {/* Sticky right column: price + agent + inquiry */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 88 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Paper sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="baseline"
                >
                  <Stack>
                    <Typography variant="h3" color="primary.main">
                      {formatKes(listing.rentAmount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      per month
                    </Typography>
                  </Stack>
                  <SaveListingButton listingId={listing.id} />
                </Stack>
              </Stack>
            </Paper>

            <Paper sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      width: 48,
                      height: 48,
                      fontWeight: 700,
                    }}
                  >
                    {initialsOf(listing.poster.fullName)}
                  </Avatar>
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {listing.poster.fullName}
                      </Typography>
                      <BadgeCheck size={16} color="#0e6b73" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {formatEnumLabel(listing.poster.role)}
                    </Typography>
                  </Stack>
                </Stack>
                <Button
                  component={Link}
                  href={`/agents/${listing.poster.userId}`}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  View profile
                </Button>
              </Stack>
            </Paper>

            <InquiryComposer listing={listing} />

            {showReport ? (
              <ReportComposer
                listingId={listing.id}
                reportedUserId={listing.poster.userId}
              />
            ) : (
              <Button
                onClick={() => setShowReport(true)}
                variant="text"
                color="error"
                size="small"
                startIcon={<FlagIcon size={14} />}
                sx={{ alignSelf: "flex-start" }}
              >
                Report this listing
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
