import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
};

const deltaColor: Record<NonNullable<KpiCardProps["deltaTone"]>, string> = {
  positive: "#15803d",
  negative: "#b91c1c",
  neutral: "#475569",
};

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  icon: Icon,
}: KpiCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={1.25}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
            {Icon ? (
              <Stack
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={16} />
              </Stack>
            ) : null}
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: 0 }}>
            {value}
          </Typography>
          {delta ? (
            <Typography
              variant="body2"
              sx={{ color: deltaColor[deltaTone], fontWeight: 600 }}
            >
              {delta}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
