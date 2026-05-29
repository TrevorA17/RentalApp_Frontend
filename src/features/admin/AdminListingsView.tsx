"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getAdminListings, updateAdminListingApproval } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import type { AdminListing, ApprovalStatus } from "@/types/domain";

const approvalStatuses: ApprovalStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export function AdminListingsView() {
  const { session } = useAuth();
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ApprovalStatus>>({});

  useEffect(() => {
    async function loadListings() {
      if (!session?.accessToken) return;
      try {
        const result = await getAdminListings();
        setListings(result);
        setDrafts(
          Object.fromEntries(
            result.map((item) => [item.id, item.approvalStatus]),
          ),
        );
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    }
    void loadListings();
  }, [session?.accessToken]);

  async function handleUpdate(listingId: string) {
    if (!session?.accessToken) return;
    try {
      const updated = await updateAdminListingApproval(
        listingId,
        drafts[listingId],
      );
      setListings((current) =>
        current.map((item) => (item.id === listingId ? updated : item)),
      );
      setSuccessMessage("Listing moderation status updated.");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(extractApiError(error));
      setSuccessMessage(null);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleUpdate captured via closure
  const columns = useMemo<GridColDef<AdminListing>[]>(
    () => [
      {
        field: "title",
        headerName: "Listing",
        flex: 1.5,
        minWidth: 220,
        renderCell: (params: GridRenderCellParams<AdminListing>) => (
          <Link href={`/listings/${params.row.id}`}>{params.row.title}</Link>
        ),
      },
      {
        field: "location",
        headerName: "Location",
        flex: 1,
        minWidth: 180,
        valueGetter: (_value, row: AdminListing) => `${row.area}, ${row.city}`,
      },
      {
        field: "owner",
        headerName: "Owner",
        flex: 1.2,
        minWidth: 220,
        valueGetter: (_value, row: AdminListing) =>
          `${row.owner.fullName} (${row.owner.email})`,
      },
      {
        field: "listingStatus",
        headerName: "Listing",
        width: 120,
      },
      {
        field: "approvalStatus",
        headerName: "Approval",
        width: 220,
        sortable: false,
        renderCell: (params: GridRenderCellParams<AdminListing>) => (
          <TextField
            select
            size="small"
            value={drafts[params.row.id] ?? params.row.approvalStatus}
            onChange={(event) =>
              setDrafts((current) => ({
                ...current,
                [params.row.id]: event.target.value as ApprovalStatus,
              }))
            }
            sx={{ minWidth: 180 }}
          >
            {approvalStatuses.map((status) => (
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
        renderCell: (params: GridRenderCellParams<AdminListing>) => (
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
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Listing moderation
        </Typography>
        <Typography variant="h2">Moderate listings</Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? (
        <Alert severity="success">{successMessage}</Alert>
      ) : null}

      <Paper sx={{ p: 0 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={listings}
            columns={columns}
            getRowId={(row) => row.id}
            autoHeight
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
              sorting: { sortModel: [{ field: "title", sort: "asc" }] },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Box>
      </Paper>
    </Stack>
  );
}
