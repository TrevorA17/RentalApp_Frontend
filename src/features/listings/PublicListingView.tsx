"use client";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import { InquiryComposer } from "@/features/inquiries/InquiryComposer";
import { ReportComposer } from "@/features/reports/ReportComposer";
import { ListingDetail } from "@/types/domain";
import { SaveListingButton } from "./SaveListingButton";

type PublicListingViewProps = {
  listing: ListingDetail;
};

export function PublicListingView({ listing }: PublicListingViewProps) {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
            <Stack spacing={2}>
              <Chip label={`${listing.listingStatus} / ${listing.approvalStatus}`} color="secondary" sx={{ width: "fit-content" }} />
              <Typography variant="h3">{listing.title}</Typography>
              <Typography variant="h5" color="primary.main">
                KES {listing.rentAmount}
              </Typography>
            </Stack>
            <Stack alignItems={{ xs: "stretch", md: "flex-end" }}>
              <SaveListingButton listingId={listing.id} variant="contained" />
            </Stack>
          </Stack>
          <Typography color="text.secondary">{listing.description}</Typography>
        </Stack>
      </Paper>

      {listing.media.length > 0 ? (
        <Paper sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2}>
            <Typography variant="h5">Media</Typography>
            <Stack spacing={2}>
              {listing.media.map((media) => (
                <Box
                  key={media.id}
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
                      sx={{ width: "100%", display: "block", maxHeight: 420, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={media.mediaUrl}
                      controls
                      sx={{ width: "100%", display: "block", maxHeight: 420 }}
                    />
                  )}
                  {media.caption ? (
                    <Typography sx={{ p: 1.5 }} color="text.secondary">
                      {media.caption}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>
      ) : null}

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h5">Property details</Typography>
          <Typography color="text.secondary">Location: {listing.city}, {listing.area}</Typography>
          <Typography color="text.secondary">Rooms: {listing.bedrooms} bedroom(s), {listing.bathrooms} bathroom(s)</Typography>
          <Typography color="text.secondary">House type: {listing.houseType}</Typography>
          <Typography color="text.secondary">Furnished: {listing.furnished ? "Yes" : "No"}</Typography>
          <Typography color="text.secondary">Availability: {listing.availabilityStatus}</Typography>
          <Typography color="text.secondary">Deposit: {listing.depositAmount ?? "Not provided"}</Typography>
          <Typography color="text.secondary">Agent fee: {listing.agentFeeAmount ?? "Not provided"}</Typography>
          <Typography color="text.secondary">
            Amenities: {listing.amenities.length > 0 ? listing.amenities.map((amenity) => amenity.name).join(", ") : "None listed"}
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h5">Posted by</Typography>
          <Typography color="text.secondary">{listing.poster.fullName} ({listing.poster.role})</Typography>
          <Typography color="text.secondary">{listing.poster.email}</Typography>
          <Link href={`/agents/${listing.poster.userId}`}>Open public profile</Link>
        </Stack>
      </Paper>

      <InquiryComposer listing={listing} />
      <ReportComposer listingId={listing.id} reportedUserId={listing.poster.userId} />
    </Stack>
  );
}
