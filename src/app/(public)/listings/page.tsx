import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { PageSection } from "@/components/shell/PageSection";

const listingCards = [
  {
    id: "sample-1",
    title: "Bright 1 Bedroom in Kilimani",
    rent: "KES 35,000",
    meta: "1 bed - 1 bath - Apartment",
    area: "Kilimani, Nairobi",
  },
  {
    id: "sample-2",
    title: "Spacious Bedsitter Near CBD Transit",
    rent: "KES 18,000",
    meta: "Studio - 1 bath - Bedsitter",
    area: "Ngara, Nairobi",
  },
];

export default function ListingsPage() {
  return (
    <PageSection>
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Typography variant="overline" color="secondary.main" fontWeight={800}>
            Module 4 Preview
          </Typography>
          <Typography variant="h2">Browse listings</Typography>
          <Typography color="text.secondary">
            This route is scaffolded now so auth and listings modules have a stable UI target.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="City" />
          <Chip label="Area" />
          <Chip label="Price" />
          <Chip label="Bedrooms" />
          <Chip label="House Type" />
          <Chip label="Amenities" />
        </Stack>

        <Grid container spacing={3}>
          {listingCards.map((listing) => (
            <Grid key={listing.id} size={{ xs: 12, md: 6 }}>
              <Link href={`/listings/${listing.id}`}>
                <Paper sx={{ display: "block", p: 3, backgroundColor: "background.paper" }}>
                  <Stack spacing={1.5}>
                    <Typography variant="h5">{listing.title}</Typography>
                    <Typography variant="h6" color="primary.main">
                      {listing.rent}
                    </Typography>
                    <Typography color="text.secondary">{listing.meta}</Typography>
                    <Typography color="text.secondary">{listing.area}</Typography>
                  </Stack>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </PageSection>
  );
}
