import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      textAlign="center"
      sx={{
        py: { xs: 5, md: 7 },
        px: 3,
        border: "1px dashed rgba(15, 23, 42, 0.12)",
        borderRadius: 2,
        bgcolor: "grey.50",
      }}
    >
      {Icon ? (
        <Stack
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
          }}
        >
          <Icon size={22} />
        </Stack>
      ) : null}
      <Stack spacing={0.5} alignItems="center">
        <Typography variant="h5">{title}</Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
            {description}
          </Typography>
        ) : null}
      </Stack>
      {action}
    </Stack>
  );
}
