"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getAdminUsers, updateAdminUserStatus } from "@/lib/api/admin";
import { AdminUser, UserStatus } from "@/types/domain";

const userStatuses: UserStatus[] = ["ACTIVE", "SUSPENDED"];

export function AdminUsersView() {
  const { session } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, UserStatus>>({});

  useEffect(() => {
    async function loadUsers() {
      if (!session?.accessToken) {
        return;
      }

      try {
        const result = await getAdminUsers();
        setUsers(result);
        setDrafts(Object.fromEntries(result.map((item) => [item.id, item.status])));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load users.";
        setErrorMessage(message);
      }
    }

    void loadUsers();
  }, [session?.accessToken]);

  async function handleUpdate(userId: string) {
    if (!session?.accessToken) {
      return;
    }

    try {
      const updated = await updateAdminUserStatus(userId, drafts[userId]);
      setUsers((current) => current.map((item) => (item.id === userId ? updated : item)));
      setSuccessMessage("User status updated.");
      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update user status.";
      setErrorMessage(message);
      setSuccessMessage(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          User operations
        </Typography>
        <Typography variant="h2">Manage users</Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      {users.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No users found.</Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {users.map((user) => (
          <Paper key={user.id} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h5">{user.fullName}</Typography>
              <Typography color="text.secondary">
                {user.email} - {user.role}
              </Typography>
              <Typography color="text.secondary">
                Status: {user.status} / Email verified: {user.emailVerified ? "Yes" : "No"}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label="Status"
                  value={drafts[user.id] ?? user.status}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [user.id]: event.target.value as UserStatus,
                    }))
                  }
                  sx={{ minWidth: 220 }}
                >
                  {userStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="contained" onClick={() => handleUpdate(user.id)}>
                  Update
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}
