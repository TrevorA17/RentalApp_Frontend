import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import FactCheckRounded from "@mui/icons-material/FactCheckRounded";
import HomeWorkRounded from "@mui/icons-material/HomeWorkRounded";
import ImageRounded from "@mui/icons-material/ImageRounded";
import ReviewsRounded from "@mui/icons-material/ReviewsRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PageSection } from "@/components/shell/PageSection";

const valueCards = [
  {
    title: "Rental-first search",
    body: "Filters are built around renting decisions: area, budget, bedrooms, amenities, and availability.",
    icon: <SearchRounded />,
  },
  {
    title: "Trust around agents",
    body: "Public recommendations and admin moderation help renters judge who they are dealing with.",
    icon: <ShieldRounded />,
  },
  {
    title: "Richer listing context",
    body: "Upload-first media, amenities, fees, and descriptions make each rental easier to evaluate.",
    icon: <ImageRounded />,
  },
  {
    title: "Helpful AI, not hype",
    body: "AI helps interpret search text and improve listing copy while structured search stays in control.",
    icon: <AutoAwesomeRounded />,
  },
];

const previewListings = [
  {
    title: "Modern 2-bedroom apartment",
    area: "Kilimani, Nairobi",
    price: "KES 48,000",
    detail: "Parking, security, balcony",
  },
  {
    title: "Quiet studio near transit",
    area: "Westlands, Nairobi",
    price: "KES 28,000",
    detail: "WiFi-ready, water backup",
  },
  {
    title: "Family maisonette",
    area: "Kiambu Road",
    price: "KES 85,000",
    detail: "Garden, borehole, gated access",
  },
];

export default function HomePage() {
  return (
    <Box>
      <PageSection>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={3}>
              <Chip
                label="Rental-only marketplace MVP"
                color="secondary"
                sx={{ width: "fit-content" }}
              />
              <Typography variant="h1" sx={{ maxWidth: 840 }}>
                Search rentals with clearer trust signals before you schedule a
                viewing.
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 760 }}
              >
                RentalApp helps renters discover homes by area, budget, and
                preferences while giving agents and landlords a structured
                workspace for listings, media, inquiries, and public trust.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  href="/listings"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRounded />}
                >
                  Browse rentals
                </Button>
                <Button href="/register" variant="outlined" size="large">
                  Create account
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              sx={{
                p: 3,
                minHeight: 420,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background:
                  "linear-gradient(145deg, rgba(14,107,115,0.94), rgba(22,35,56,0.94))",
                color: "white",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: "auto -20% -28% 18%",
                  height: 260,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(200,107,42,0.42), transparent 64%)",
                }}
              />
              <Stack spacing={2} sx={{ position: "relative" }}>
                <Typography variant="overline" sx={{ opacity: 0.8 }}>
                  Try the search helper
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    background: "rgba(255,255,255,0.12)",
                    borderColor: "rgba(255,255,255,0.18)",
                  }}
                >
                  <Typography fontWeight={800}>
                    &quot;2 bedroom in Kilimani under 50k with parking&quot;
                  </Typography>
                </Paper>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {[
                    "Area: Kilimani",
                    "2 bedrooms",
                    "Max KES 50,000",
                    "Parking",
                  ].map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.35)",
                      }}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Stack>
              <Stack spacing={1.2} sx={{ position: "relative" }}>
                <Typography variant="h5">
                  Structured discovery stays in control.
                </Typography>
                <Typography sx={{ opacity: 0.82 }}>
                  AI suggests filters, then the marketplace uses real listing
                  data, pagination, and sorting.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </PageSection>

      <PageSection>
        <Stack spacing={3}>
          <Stack spacing={1} maxWidth={760}>
            <Typography
              variant="overline"
              color="secondary.main"
              fontWeight={900}
            >
              Why it exists
            </Typography>
            <Typography variant="h2">
              A cleaner alternative to generic classifieds.
            </Typography>
            <Typography color="text.secondary">
              The MVP focuses on rental-specific workflows: better listing
              structure, inquiry tracking, agent recommendations, reports, and
              admin trust operations.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {valueCards.map((card) => (
              <Grid key={card.title} size={{ xs: 12, md: 6, lg: 3 }}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Stack spacing={2}>
                    <Box sx={{ color: "primary.main" }}>{card.icon}</Box>
                    <Typography variant="h5">{card.title}</Typography>
                    <Typography color="text.secondary">{card.body}</Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </PageSection>

      <PageSection>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Stack spacing={2}>
                <Chip
                  label="For renters"
                  color="primary"
                  sx={{ width: "fit-content" }}
                />
                <Typography variant="h3">
                  Shortlist homes with less guesswork.
                </Typography>
                <Stack spacing={1.2}>
                  {[
                    "Browse by area and budget",
                    "Use AI to fill structured filters",
                    "Save listings and send inquiries",
                    "Review agent recommendations before engaging",
                  ].map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <FactCheckRounded color="secondary" fontSize="small" />
                      <Typography>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Stack spacing={2}>
                <Chip
                  label="For agents and landlords"
                  color="secondary"
                  sx={{ width: "fit-content" }}
                />
                <Typography variant="h3">
                  Manage listings from a real workspace.
                </Typography>
                <Stack spacing={1.2}>
                  {[
                    "Create and publish rental listings",
                    "Upload images and clarify fees",
                    "Use AI to strengthen descriptions",
                    "Receive inquiries and build profile trust",
                  ].map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >
                      <HomeWorkRounded color="primary" fontSize="small" />
                      <Typography>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </PageSection>

      <PageSection>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={1} maxWidth={720}>
              <Typography
                variant="overline"
                color="secondary.main"
                fontWeight={900}
              >
                Marketplace preview
              </Typography>
              <Typography variant="h2">
                Listings should feel structured, visual, and comparable.
              </Typography>
            </Stack>
            <Button
              href="/listings"
              variant="outlined"
              endIcon={<ArrowForwardRounded />}
              sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
            >
              Open live browse
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {previewListings.map((listing, index) => (
              <Grid key={listing.title} size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 2.5, height: "100%" }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        height: 170,
                        borderRadius: 4,
                        background:
                          index === 0
                            ? "linear-gradient(135deg, rgba(14,107,115,0.18), rgba(200,107,42,0.26))"
                            : index === 1
                              ? "linear-gradient(135deg, rgba(113,158,120,0.2), rgba(14,107,115,0.16))"
                              : "linear-gradient(135deg, rgba(22,35,56,0.12), rgba(200,107,42,0.22))",
                        display: "grid",
                        placeItems: "center",
                        color: "primary.main",
                      }}
                    >
                      <HomeWorkRounded sx={{ fontSize: 54 }} />
                    </Box>
                    <Stack spacing={0.75}>
                      <Typography variant="h5">{listing.title}</Typography>
                      <Typography color="text.secondary">
                        {listing.area}
                      </Typography>
                      <Typography color="primary.main" fontWeight={900}>
                        {listing.price}
                      </Typography>
                      <Typography color="text.secondary">
                        {listing.detail}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </PageSection>

      <PageSection>
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            background:
              "linear-gradient(135deg, rgba(255,250,244,0.96), rgba(14,107,115,0.12))",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={1.5}>
                <Chip
                  icon={<ReviewsRounded />}
                  label="Trust feature"
                  color="secondary"
                  sx={{ width: "fit-content" }}
                />
                <Typography variant="h2">
                  Recommendations are agent testimonials, not listing
                  suggestions.
                </Typography>
                <Typography color="text.secondary">
                  Public agent profiles can show moderated recommendations from
                  real users. Personalized listing picks remain separate as
                  suggestions inside the signed-in workspace.
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={1.5}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography fontWeight={800}>Clear terminology</Typography>
                  <Typography color="text.secondary">
                    Recommendations build public agent trust. Suggestions help
                    signed-in renters discover listings.
                  </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography fontWeight={800}>
                    Admin-backed moderation
                  </Typography>
                  <Typography color="text.secondary">
                    Admin trust operations review reports, listings, users, and
                    public recommendations.
                  </Typography>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </PageSection>

      <PageSection>
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(14,107,115,0.96), rgba(22,35,56,0.94))",
            color: "white",
          }}
        >
          <Stack spacing={2.5} alignItems="center">
            <Typography variant="h2" maxWidth={820}>
              Ready to walk through the live rental marketplace flow?
            </Typography>
            <Typography sx={{ opacity: 0.84 }} maxWidth={700}>
              Browse public listings, create an account, publish a media-rich
              rental, test inquiries, and review trust operations from the admin
              workspace.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button href="/listings" variant="contained" color="secondary">
                Browse rentals
              </Button>
              <Button
                href="/register"
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.45)" }}
              >
                Create account
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </PageSection>
    </Box>
  );
}
