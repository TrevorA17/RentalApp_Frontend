import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { ListingSummary } from "@/types/domain";

type ListingCardProps = {
  listing: ListingSummary;
  renderActions?: () => React.ReactNode;
};

function formatPrice(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function formatHouseType(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ListingCard({ listing, renderActions }: ListingCardProps) {
  const hasPhoto = Boolean(listing.thumbnailUrl);

  return (
    <Card
      sx={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 150ms ease, transform 150ms ease",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        component={Link}
        href={`/listings/${listing.id}`}
        sx={{
          position: "relative",
          display: "block",
          aspectRatio: "4 / 3",
          background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
          overflow: "hidden",
        }}
      >
        {hasPhoto ? (
          <Box
            component="img"
            src={listing.thumbnailUrl ?? undefined}
            alt={listing.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: "text.disabled",
              fontSize: "0.8125rem",
            }}
          >
            No photo
          </Box>
        )}
        {renderActions ? (
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            {renderActions()}
          </Box>
        ) : null}
        <Chip
          label={formatHouseType(listing.houseType)}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            backgroundColor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(4px)",
            fontWeight: 600,
          }}
        />
      </Box>
      <Stack spacing={1.25} sx={{ p: 2, flex: 1 }}>
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, minWidth: 0 }} noWrap>
            {listing.title}
          </Typography>
          <Typography
            variant="h6"
            color="primary.main"
            sx={{ flexShrink: 0, fontWeight: 700 }}
          >
            {formatPrice(listing.rentAmount)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          color="text.secondary"
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" noWrap>
            {listing.area}, {listing.city}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ color: "text.secondary", mt: "auto", pt: 0.5 }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <BedOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              {listing.bedrooms} {listing.bedrooms === 1 ? "bed" : "beds"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <BathtubOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              {listing.bathrooms} {listing.bathrooms === 1 ? "bath" : "baths"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
