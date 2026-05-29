"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getMyProfile, saveMyProfile } from "@/lib/api/profiles";

export function ProfileForm() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [feeStructure, setFeeStructure] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getMyProfile();
        setFullName(profile.fullName ?? "");
        setPhoneNumber(profile.phoneNumber ?? "");
        setBio(profile.bio ?? "");
        setCity(profile.city ?? "");
        setServiceAreas((profile.serviceAreas ?? []).join(", "));
        setCompanyName(profile.companyName ?? "");
        setFeeStructure(profile.feeStructure ?? "");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load profile.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [session]);

  if (!session) {
    return null;
  }

  const isAgent = session.user.role === "AGENT";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      await saveMyProfile({
        fullName,
        phoneNumber,
        bio,
        city,
        serviceAreas: serviceAreas
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        companyName: isAgent ? companyName : undefined,
        feeStructure: isAgent ? feeStructure : undefined,
      });

      setSuccessMessage("Profile saved successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save profile.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Chip
            label={`${session.user.role} profile`}
            color="secondary"
            sx={{ width: "fit-content" }}
          />
          <Typography variant="h3">Manage profile</Typography>
          <Typography color="text.secondary" maxWidth={720}>
            This profile data will power listing poster summaries, public trust
            signals, and later agent profile views.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? (
            <Alert severity="success">{successMessage}</Alert>
          ) : null}

          <TextField
            label="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            fullWidth
            required
            disabled={isLoading || isSaving}
          />
          <TextField
            label="Phone number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            fullWidth
            disabled={isLoading || isSaving}
          />
          <TextField
            label="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            fullWidth
            disabled={isLoading || isSaving}
          />
          <TextField
            label="Bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            fullWidth
            minRows={4}
            multiline
            disabled={isLoading || isSaving}
          />
          <TextField
            label="Service areas"
            value={serviceAreas}
            onChange={(event) => setServiceAreas(event.target.value)}
            helperText="Separate areas with commas."
            fullWidth
            disabled={isLoading || isSaving}
          />

          {isAgent ? (
            <>
              <TextField
                label="Company name"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                fullWidth
                disabled={isLoading || isSaving}
              />
              <TextField
                label="Fee structure"
                value={feeStructure}
                onChange={(event) => setFeeStructure(event.target.value)}
                fullWidth
                minRows={3}
                multiline
                disabled={isLoading || isSaving}
              />
            </>
          ) : null}

          <Stack direction="row">
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || isSaving}
            >
              {isSaving ? "Saving..." : "Save profile"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
