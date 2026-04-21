import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { InquiryComposer } from "@/features/inquiries/InquiryComposer";
import { ReportComposer } from "@/features/reports/ReportComposer";
import { ListingDetail } from "@/types/domain";
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
  if (value === undefined || value === null) {
    return "Not provided";
  }

  return `KES ${Number(value).toLocaleString()}`;
}

export function PublicListingView({ listing }: PublicListingViewProps) {
  const heroMedia = listing.media.find((media) => media.mediaType === "IMAGE");

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 }, overflow: "hidden" }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, md: heroMedia ? 7 : 12 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={formatEnumLabel(listing.houseType)} color="secondary" sx={{ width: "fit-content" }} />
                <Chip label={formatEnumLabel(listing.availabilityStatus)} variant="outlined" sx={{ width: "fit-content" }} />
                {listing.furnished ? <Chip label="Furnished" variant="outlined" sx={{ width: "fit-content" }} /> : null}
              </Stack>
              <Typography variant="h3">{listing.title}</Typography>
              <Typography variant="h5" color="primary.main">
                {formatKes(listing.rentAmount)}
              </Typography>
              <Typography color="text.secondary">{listing.description}</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <SaveListingButton listingId={listing.id} variant="contained" />
                <Link href={`/agents/${listing.poster.userId}`}>View agent profile</Link>
              </Stack>
            </Stack>
          </Grid>
          {heroMedia ? (
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src={heroMedia.mediaUrl}
                alt={heroMedia.caption || listing.title}
                sx={{ width: "100%", height: "100%", minHeight: 300, objectFit: "cover", borderRadius: 4 }}
              />
            </Grid>
          ) : null}
        </Grid>
      </Paper>

      {listing.media.length > 1 ? (
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2}>
            <Typography variant="h5">Gallery</Typography>
            <Grid container spacing={2}>
              {listing.media.map((media) => (
                <Grid key={media.id} size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      backgroundColor: "grey.100",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {media.mediaType === "IMAGE" ? (
                      <Box
                        component="img"
                        src={media.mediaUrl}
                        alt={media.caption || listing.title}
                        sx={{ width: "100%", display: "block", height: 260, objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        component="video"
                        src={media.mediaUrl}
                        controls
                        sx={{ width: "100%", display: "block", maxHeight: 260 }}
                      />
                    )}
                    {media.caption ? (
                      <Typography sx={{ p: 1.5 }} color="text.secondary">
                        {media.caption}
                      </Typography>
                    ) : null}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
      ) : null}

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Typography variant="h5">Property details</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Location</Typography>
              <Typography>{listing.area}, {listing.city}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Rooms</Typography>
              <Typography>{listing.bedrooms} bed, {listing.bathrooms} bath</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Deposit</Typography>
              <Typography>{formatKes(listing.depositAmount)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Agent fee</Typography>
              <Typography>{formatKes(listing.agentFeeAmount)}</Typography>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {listing.amenities.length > 0 ? (
              listing.amenities.map((amenity) => <Chip key={amenity.id} label={amenity.name} variant="outlined" />)
            ) : (
              <Chip label="No amenities listed" variant="outlined" />
            )}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h5">Posted by</Typography>
          <Typography color="text.secondary">{listing.poster.fullName} ({formatEnumLabel(listing.poster.role)})</Typography>
          <Typography color="text.secondary">{listing.poster.email}</Typography>
          <Link href={`/agents/${listing.poster.userId}`}>Open public profile</Link>
        </Stack>
      </Paper>

      <InquiryComposer listing={listing} />
      <ReportComposer listingId={listing.id} reportedUserId={listing.poster.userId} />
    </Stack>
  );
}
