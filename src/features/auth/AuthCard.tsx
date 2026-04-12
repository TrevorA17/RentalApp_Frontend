"use client";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { PropsWithChildren } from "react";

type AuthCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export function AuthCard({ eyebrow, title, description, children }: AuthCardProps) {
  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        maxWidth: 560,
        mx: "auto",
        background:
          "linear-gradient(180deg, rgba(255,250,244,0.98) 0%, rgba(255,255,255,0.98) 100%)",
        border: "1px solid rgba(19, 34, 58, 0.08)",
      }}
    >
      <Stack spacing={2.5}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          {eyebrow}
        </Typography>
        <Typography variant="h3">{title}</Typography>
        <Typography color="text.secondary" maxWidth={460}>
          {description}
        </Typography>
        {children}
      </Stack>
    </Paper>
  );
}
