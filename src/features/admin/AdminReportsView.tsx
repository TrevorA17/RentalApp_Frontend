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
import { getAdminReports, updateAdminReportStatus } from "@/lib/api/admin";
import { Report, ReportStatus } from "@/types/domain";

const reportStatuses: ReportStatus[] = ["OPEN", "RESOLVED", "DISMISSED"];

export function AdminReportsView() {
  const { session } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ReportStatus>>({});

  useEffect(() => {
    async function loadReports() {
      if (!session?.accessToken) {
        return;
      }

      try {
        const result = await getAdminReports(session.accessToken);
        setReports(result);
        setDrafts(Object.fromEntries(result.map((item) => [item.id, item.status])));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load reports.";
        setErrorMessage(message);
      }
    }

    void loadReports();
  }, [session?.accessToken]);

  async function handleUpdate(reportId: string) {
    if (!session?.accessToken) {
      return;
    }

    try {
      const updated = await updateAdminReportStatus(session.accessToken, reportId, drafts[reportId]);
      setReports((current) => current.map((item) => (item.id === reportId ? updated : item)));
      setSuccessMessage("Report status updated.");
      setErrorMessage(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update report status.";
      setErrorMessage(message);
      setSuccessMessage(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>
          Module 9
        </Typography>
        <Typography variant="h2">Reports</Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      {reports.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No reports have been submitted yet.</Typography>
        </Paper>
      ) : null}

      <Stack spacing={2}>
        {reports.map((report) => (
          <Paper key={report.id} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="h5">{report.reason}</Typography>
              <Typography color="text.secondary">
                Reporter: {report.reporter.fullName} ({report.reporter.email})
              </Typography>
              {report.listing ? (
                <Typography color="text.secondary">
                  Listing: {report.listing.title} in {report.listing.area}, {report.listing.city}
                </Typography>
              ) : null}
              {report.reportedUser ? (
                <Typography color="text.secondary">
                  Reported user: {report.reportedUser.fullName} ({report.reportedUser.email})
                </Typography>
              ) : null}
              {report.details ? <Typography color="text.secondary">{report.details}</Typography> : null}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label="Status"
                  value={drafts[report.id] ?? report.status}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [report.id]: event.target.value as ReportStatus,
                    }))
                  }
                  sx={{ minWidth: 220 }}
                >
                  {reportStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="contained" onClick={() => handleUpdate(report.id)}>
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
