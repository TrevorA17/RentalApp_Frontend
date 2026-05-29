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
import { getAdminReports, updateAdminReportStatus } from "@/lib/api/admin";
import { extractApiError } from "@/lib/api/client";
import type { Report, ReportStatus } from "@/types/domain";

const reportStatuses: ReportStatus[] = ["OPEN", "RESOLVED", "DISMISSED"];

export function AdminReportsView() {
  const { session } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ReportStatus>>({});

  useEffect(() => {
    async function loadReports() {
      if (!session?.accessToken) return;
      try {
        const result = await getAdminReports();
        setReports(result);
        setDrafts(
          Object.fromEntries(result.map((item) => [item.id, item.status])),
        );
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    }
    void loadReports();
  }, [session?.accessToken]);

  async function handleUpdate(reportId: string) {
    if (!session?.accessToken) return;
    try {
      const updated = await updateAdminReportStatus(reportId, drafts[reportId]);
      setReports((current) =>
        current.map((item) => (item.id === reportId ? updated : item)),
      );
      setSuccessMessage("Report status updated.");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(extractApiError(error));
      setSuccessMessage(null);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleUpdate captured via closure
  const columns = useMemo<GridColDef<Report>[]>(
    () => [
      { field: "reason", headerName: "Reason", flex: 1.2, minWidth: 200 },
      {
        field: "reporter",
        headerName: "Reporter",
        flex: 1.2,
        minWidth: 220,
        valueGetter: (_value, row: Report) =>
          `${row.reporter.fullName} (${row.reporter.email})`,
      },
      {
        field: "listing",
        headerName: "Listing",
        flex: 1.2,
        minWidth: 220,
        valueGetter: (_value, row: Report) =>
          row.listing
            ? `${row.listing.title} - ${row.listing.area}, ${row.listing.city}`
            : "-",
      },
      {
        field: "reportedUser",
        headerName: "Reported user",
        flex: 1,
        minWidth: 200,
        valueGetter: (_value, row: Report) =>
          row.reportedUser
            ? `${row.reportedUser.fullName} (${row.reportedUser.email})`
            : "-",
      },
      {
        field: "status",
        headerName: "Status",
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Report>) => (
          <TextField
            select
            size="small"
            value={drafts[params.row.id] ?? params.row.status}
            onChange={(event) =>
              setDrafts((current) => ({
                ...current,
                [params.row.id]: event.target.value as ReportStatus,
              }))
            }
            sx={{ minWidth: 160 }}
          >
            {reportStatuses.map((status) => (
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
        renderCell: (params: GridRenderCellParams<Report>) => (
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
        eyebrow="Trust reports"
        title="Reports"
        subtitle="Review user-submitted reports on listings and other accounts."
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
        rows={reports}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          sorting: { sortModel: [{ field: "status", sort: "asc" }] },
        }}
      />
    </Box>
  );
}
