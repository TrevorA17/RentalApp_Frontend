"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Building2, Menu as MenuIcon } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AuthGuard } from "@/features/auth/AuthGuard";
import { useAuth } from "@/features/auth/AuthProvider";
import { ADMIN_NAV, APP_NAV_BY_ROLE, type NavItem } from "./navConfig";
import { UserMenu } from "./UserMenu";

const SIDEBAR_WIDTH = 248;

type DashboardShellProps = PropsWithChildren<{
  mode: "app" | "admin";
}>;

function SidebarNav({
  items,
  mode,
  onNavigate,
}: {
  items: NavItem[];
  mode: "app" | "admin";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Stack sx={{ height: "100%" }}>
      <Stack
        component={NextLink}
        href="/dashboard"
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          px: 2.5,
          py: 2,
          textDecoration: "none",
          color: "text.primary",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
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
          <Building2 size={18} />
        </Stack>
        <Stack spacing={0}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, lineHeight: 1 }}
          >
            RentalApp
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {mode === "admin" ? "Trust operations" : "Workspace"}
          </Typography>
        </Stack>
      </Stack>
      <List sx={{ p: 1.5, flex: 1 }}>
        {items.map((item) => {
          const Icon = item.icon;
          const selected =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/admin" &&
              pathname?.startsWith(`${item.href}/`));
          return (
            <ListItemButton
              key={item.href}
              component={NextLink}
              href={item.href}
              onClick={onNavigate}
              selected={Boolean(selected)}
              sx={{
                px: 1.5,
                py: 1,
                mb: 0.25,
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                <Icon size={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Stack>
  );
}

export function DashboardShell({ children, mode }: DashboardShellProps) {
  const { session } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] =
    mode === "admin"
      ? ADMIN_NAV
      : session
        ? APP_NAV_BY_ROLE[session.user.role]
        : [];

  return (
    <AuthGuard allowedRoles={mode === "admin" ? ["ADMIN"] : undefined}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
        {/* Permanent sidebar on md+ */}
        <Box
          component="nav"
          sx={{
            width: { md: SIDEBAR_WIDTH },
            flexShrink: { md: 0 },
            display: { xs: "none", md: "block" },
          }}
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: SIDEBAR_WIDTH,
                boxSizing: "border-box",
                borderRight: "1px solid rgba(15, 23, 42, 0.08)",
                bgcolor: "background.paper",
              },
            }}
          >
            <SidebarNav items={navItems} mode={mode} />
          </Drawer>
        </Box>

        {/* Temporary drawer on xs/sm */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          <SidebarNav
            items={navItems}
            mode={mode}
            onNavigate={() => setMobileOpen(false)}
          />
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AppBar
            position="sticky"
            sx={{
              width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
              ml: { md: `${SIDEBAR_WIDTH}px` },
              left: 0,
            }}
          >
            <Toolbar sx={{ gap: 1.5, px: { xs: 2, md: 3 } }}>
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { md: "none" } }}
              >
                <MenuIcon size={20} />
              </IconButton>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Breadcrumbs />
              </Box>
              <UserMenu />
            </Toolbar>
          </AppBar>

          <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>{children}</Box>
        </Box>
      </Box>
    </AuthGuard>
  );
}
