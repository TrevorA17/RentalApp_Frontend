"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/features/auth/AuthProvider";
import { getAdminUsers, updateAdminUserStatus } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import type { AdminUser, UserStatus } from "@/types/domain";

const userStatuses: UserStatus[] = ["ACTIVE", "SUSPENDED"];

export function AdminUsersView() {
  const { session } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, UserStatus>>({});

  useEffect(() => {
    async function loadUsers() {
      if (!session?.accessToken) return;
      try {
        const result = await getAdminUsers();
        setUsers(result);
        setDrafts(
          Object.fromEntries(result.map((item) => [item.id, item.status])),
        );
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    }
    void loadUsers();
  }, [session?.accessToken]);

  async function handleUpdate(userId: string) {
    if (!session?.accessToken) return;
    try {
      const updated = await updateAdminUserStatus(userId, drafts[userId]);
      setUsers((current) =>
        current.map((item) => (item.id === userId ? updated : item)),
      );
      setSuccessMessage("User status updated.");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(extractApiError(error));
      setSuccessMessage(null);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleUpdate captured via closure
  const columns = useMemo<GridColDef<AdminUser>[]>(
    () => [
      { field: "fullName", headerName: "Name", flex: 1.2, minWidth: 200 },
      { field: "email", headerName: "Email", flex: 1.5, minWidth: 240 },
      { field: "role", headerName: "Role", width: 130 },
      {
        field: "emailVerified",
        headerName: "Verified",
        width: 110,
        valueGetter: (_value, row: AdminUser) =>
          row.emailVerified ? "Yes" : "No",
      },
      {
        field: "status",
        headerName: "Status",
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminUser>) => (
          <TextField
            select
            size="small"
            value={drafts[params.row.id] ?? params.row.status}
            onChange={(event) =>
              setDrafts((current) => ({
                ...current,
                [params.row.id]: event.target.value as UserStatus,
              }))
            }
            sx={{ minWidth: 160 }}
          >
            {userStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<AdminUser>) => (
          <Button
            size="small"
            variant="contained"
            onClick={() => handleUpdate(params.row.id)}
          >
            Update
          </Button>
        ),
      },
    ],
    [drafts],
  );

  return (
    <Box>
      <PageHeader
        eyebrow="User operations"
        title="Manage users"
        subtitle="Suspend or restore accounts as needed."
      />

      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}
      {successMessage ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      ) : null}

      <DataTable
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          sorting: { sortModel: [{ field: "fullName", sort: "asc" }] },
        }}
      />
    </Box>
  );
}
