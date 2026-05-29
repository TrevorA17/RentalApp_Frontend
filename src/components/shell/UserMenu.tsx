"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LogOut, Settings, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";

function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!session) return null;

  function open(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function close() {
    setAnchorEl(null);
  }

  async function handleLogout() {
    close();
    await logout();
    router.replace("/login");
  }

  return (
    <>
      <IconButton onClick={open} size="small" sx={{ ml: 1 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontSize: "0.8125rem",
            fontWeight: 700,
          }}
        >
          {initialsOf(session.user.fullName)}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="subtitle2" noWrap>
            {session.user.fullName}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
              {session.user.role.toLowerCase()}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {session.user.email}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            close();
            router.push("/profile");
          }}
        >
          <ListItemIcon>
            <UserCircle2 size={16} />
          </ListItemIcon>
          Profile
        </MenuItem>
        {session.user.role === "ADMIN" ? (
          <MenuItem
            onClick={() => {
              close();
              router.push("/admin");
            }}
          >
            <ListItemIcon>
              <Settings size={16} />
            </ListItemIcon>
            Admin workspace
          </MenuItem>
        ) : null}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={16} />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
}
