"use client";

import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  listings: "Listings",
  "my-listings": "My listings",
  "saved-listings": "Saved",
  inquiries: "Inquiries",
  sent: "Sent",
  received: "Received",
  profile: "Profile",
  agents: "Agents",
  users: "Users",
  reports: "Reports",
  recommendations: "Recommendations",
  new: "New",
  edit: "Edit",
};

function humanize(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  // Dynamic segment ids (UUIDs, ulids) — show a short token instead of the raw id
  if (segment.length > 8) return `#${segment.slice(0, 6)}`;
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = humanize(segment);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <MuiBreadcrumbs
      separator={<ChevronRight size={14} />}
      aria-label="breadcrumb"
      sx={{ "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap" } }}
    >
      {crumbs.map((crumb) =>
        crumb.isLast ? (
          <Typography
            key={crumb.href}
            variant="body2"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            {crumb.label}
          </Typography>
        ) : (
          <Typography
            key={crumb.href}
            component={Link}
            href={crumb.href}
            variant="body2"
            sx={{
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { color: "primary.main" },
            }}
          >
            {crumb.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  );
}
