"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { Role } from "@/types/domain";

const roleNavigation: Record<Role, Array<{ href: string; label: string; note: string }>> = {
  RENTER: [
    { href: "/dashboard", label: "Dashboard", note: "See recommendations and quick actions." },
    { href: "/listings", label: "Browse listings", note: "Search, save, and report public listings." },
    { href: "/saved-listings", label: "Saved listings", note: "Revisit shortlisted homes quickly." },
    { href: "/inquiries/sent", label: "Sent inquiries", note: "Track outreach to owners and agents." },
    { href: "/profile", label: "Profile", note: "Improve recommendations with better profile data." },
  ],
  AGENT: [
    { href: "/dashboard", label: "Dashboard", note: "Recommendations and workflow shortcuts." },
    { href: "/my-listings", label: "My listings", note: "Create, edit, publish, and add media." },
    { href: "/my-listings/new", label: "New listing", note: "Use AI assist before publishing." },
    { href: "/inquiries/received", label: "Received inquiries", note: "Respond to renter interest." },
    { href: "/profile", label: "Profile", note: "Keep your public agent profile current." },
  ],
  LANDLORD: [
    { href: "/dashboard", label: "Dashboard", note: "Recommendations and workflow shortcuts." },
    { href: "/my-listings", label: "My listings", note: "Create, edit, publish, and add media." },
    { href: "/my-listings/new", label: "New listing", note: "Use AI assist before publishing." },
    { href: "/inquiries/received", label: "Received inquiries", note: "Follow up on interested renters." },
    { href: "/profile", label: "Profile", note: "Update your owner profile and contact details." },
  ],
  ADMIN: [
    { href: "/admin", label: "Admin overview", note: "Protected moderation workspace." },
    { href: "/admin/listings", label: "Moderate listings", note: "Approve or reject listing changes." },
    { href: "/admin/recommendations", label: "Moderate recommendations", note: "Review public agent testimonials." },
    { href: "/admin/reports", label: "Reports", note: "Review flags raised by renters." },
    { href: "/admin/users", label: "Manage users", note: "Suspend or restore accounts." },
  ],
};

type WorkspaceSidebarProps = {
  mode: "app" | "admin";
};

export function WorkspaceSidebar({ mode }: WorkspaceSidebarProps) {
  const { session } = useAuth();
  const pathname = usePathname();

  if (!session) {
    return null;
  }

  const items = roleNavigation[session.user.role].filter((item) =>
    mode === "admin" ? item.href.startsWith("/admin") : !item.href.startsWith("/admin"),
  );

  return (
    <Paper
      sx={{
        p: 3,
        minWidth: { lg: 300 },
        width: "100%",
        position: { lg: "sticky" },
        top: { lg: 96 },
        background:
          mode === "admin"
            ? "linear-gradient(180deg, rgba(14,107,115,0.12), rgba(255,250,244,0.94))"
            : "linear-gradient(180deg, rgba(200,107,42,0.12), rgba(255,250,244,0.94))",
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Chip label={mode === "admin" ? "Admin" : "Workspace"} color="secondary" sx={{ width: "fit-content" }} />
          <Typography variant="h6">
            {mode === "admin" ? "Moderation controls" : `${session.user.role.toLowerCase()} workspace`}
          </Typography>
          <Typography color="text.secondary">
            {mode === "admin"
              ? "Use this panel to walk listing review, reports, and user actions without leaving the UI."
              : "These routes cover the live MVP flow so you can validate behavior from the frontend, not just the API."}
          </Typography>
        </Stack>

        <Stack spacing={1.25}>
          {items.map((item) => (
            <Box
              key={item.href}
              component={Link}
              href={item.href}
              sx={{
                p: 1.75,
                borderRadius: 3,
                border:
                  pathname === item.href
                    ? "1px solid rgba(14, 107, 115, 0.45)"
                    : "1px solid rgba(19, 34, 58, 0.08)",
                background:
                  pathname === item.href
                    ? "linear-gradient(135deg, rgba(14,107,115,0.12), rgba(255,255,255,0.92))"
                    : "rgba(255,255,255,0.72)",
                transition: "transform 180ms ease, border-color 180ms ease, background 180ms ease",
                "&:hover": {
                  transform: "translateX(4px)",
                  borderColor: "primary.main",
                },
              }}
            >
              <Typography fontWeight={700}>{item.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.note}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
