import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
}: PlaceholderPageProps) {
  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        backgroundColor: "background.paper",
      }}
    >
      <Stack spacing={2.5}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          {eyebrow}
        </Typography>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={720}>
          {description}
        </Typography>
        {primaryHref && primaryLabel ? (
          <Stack direction="row">
            <Button href={primaryHref} variant="contained">
              {primaryLabel}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
