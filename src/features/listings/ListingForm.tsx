"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  createListing,
  getAmenities,
  getListingById,
  publishListing,
  updateListing,
} from "@/lib/api/listings";
import { useAuth } from "@/features/auth/AuthProvider";
import { Amenity, AvailabilityStatus, HouseType } from "@/types/domain";

type ListingFormProps = {
  mode: "create" | "edit";
  listingId?: string;
};

const houseTypes: HouseType[] = [
  "APARTMENT",
  "BEDSITTER",
  "STUDIO",
  "MAISONETTE",
  "BUNGALOW",
  "HOUSE",
  "TOWNHOUSE",
];

const availabilityStatuses: AvailabilityStatus[] = [
  "AVAILABLE_NOW",
  "AVAILABLE_SOON",
  "OCCUPIED",
];

export function ListingForm({ mode, listingId }: ListingFormProps) {
  const router = useRouter();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [agentFeeAmount, setAgentFeeAmount] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [houseType, setHouseType] = useState<HouseType>("APARTMENT");
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>("AVAILABLE_NOW");
  const [furnished, setFurnished] = useState(false);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const [amenityOptions, existingListing] = await Promise.all([
          getAmenities(),
          mode === "edit" && listingId ? getListingById(listingId, session.accessToken) : Promise.resolve(null),
        ]);

        setAmenities(amenityOptions);

        if (existingListing) {
          setTitle(existingListing.title);
          setDescription(existingListing.description);
          setRentAmount(String(existingListing.rentAmount));
          setDepositAmount(existingListing.depositAmount ? String(existingListing.depositAmount) : "");
          setAgentFeeAmount(existingListing.agentFeeAmount ? String(existingListing.agentFeeAmount) : "");
          setCity(existingListing.city);
          setArea(existingListing.area);
          setBedrooms(String(existingListing.bedrooms));
          setBathrooms(String(existingListing.bathrooms));
          setHouseType(existingListing.houseType);
          setAvailabilityStatus(existingListing.availabilityStatus);
          setFurnished(existingListing.furnished);
          setSelectedAmenityIds(existingListing.amenities.map((amenity) => amenity.id));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load listing form.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [listingId, mode, session]);

  if (!session) {
    return null;
  }

  const accessToken = session.accessToken;
  if (session.user.role !== "AGENT" && session.user.role !== "LANDLORD") {
    return (
      <Alert severity="warning">
        Only agent and landlord accounts can create and manage listings.
      </Alert>
    );
  }

  function toggleAmenity(id: string) {
    setSelectedAmenityIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const payload = {
        title,
        description,
        rentAmount: Number(rentAmount),
        depositAmount: depositAmount ? Number(depositAmount) : undefined,
        agentFeeAmount: agentFeeAmount ? Number(agentFeeAmount) : undefined,
        city,
        area,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        houseType,
        furnished,
        availabilityStatus,
        amenityIds: selectedAmenityIds,
      };

      const listing =
        mode === "create"
          ? await createListing(accessToken, payload)
          : await updateListing(accessToken, listingId!, payload);

      setSuccessMessage(mode === "create" ? "Listing draft created." : "Listing updated.");
      router.replace(`/my-listings/${listing.id}/edit`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save listing.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    if (!listingId) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      await publishListing(accessToken, listingId);
      setSuccessMessage("Listing published successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish listing.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Chip label="Module 3" color="secondary" sx={{ width: "fit-content" }} />
          <Typography variant="h3">{mode === "create" ? "Create listing" : "Edit listing"}</Typography>
          <Typography color="text.secondary">
            Start with draft-quality listing data. Search and public discovery will use this foundation in the next module.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading || isSaving} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required multiline minRows={4} disabled={isLoading || isSaving} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField label="Rent amount" type="number" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} required fullWidth disabled={isLoading || isSaving} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField label="Deposit amount" type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} fullWidth disabled={isLoading || isSaving} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField label="Agent fee amount" type="number" value={agentFeeAmount} onChange={(e) => setAgentFeeAmount(e.target.value)} fullWidth disabled={isLoading || isSaving} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} required fullWidth disabled={isLoading || isSaving} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Area / neighborhood" value={area} onChange={(e) => setArea(e.target.value)} required fullWidth disabled={isLoading || isSaving} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField label="Bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required fullWidth disabled={isLoading || isSaving} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField label="Bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required fullWidth disabled={isLoading || isSaving} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select SelectProps={{ native: true }} label="House type" value={houseType} onChange={(e) => setHouseType(e.target.value as HouseType)} fullWidth disabled={isLoading || isSaving}>
                {houseTypes.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField select SelectProps={{ native: true }} label="Availability" value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)} fullWidth disabled={isLoading || isSaving}>
                {availabilityStatuses.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <FormControlLabel
            control={<Checkbox checked={furnished} onChange={(e) => setFurnished(e.target.checked)} />}
            label="Furnished"
          />

          <Stack spacing={1}>
            <Typography fontWeight={700}>Amenities</Typography>
            <Grid container spacing={1}>
              {amenities.map((amenity) => (
                <Grid key={amenity.id} size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedAmenityIds.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                        disabled={isLoading || isSaving}
                      />
                    }
                    label={amenity.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={isLoading || isSaving}>
              {isSaving ? "Saving..." : mode === "create" ? "Create draft" : "Save changes"}
            </Button>
            {mode === "edit" ? (
              <Button type="button" variant="outlined" onClick={handlePublish} disabled={isLoading || isSaving}>
                Publish
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
