"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
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
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  createListing,
  getAmenities,
  getListingById,
  publishListing,
  uploadListingImage,
  updateListing,
} from "@/lib/api/listings";
import { AiDescriptionAssist } from "@/features/ai/AiDescriptionAssist";
import { useAuth } from "@/features/auth/AuthProvider";
import { Amenity, AvailabilityStatus, HouseType, MediaType } from "@/types/domain";

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

const mediaTypes: MediaType[] = ["IMAGE", "VIDEO"];

type ListingMediaDraft = {
  clientId: string;
  mediaType: MediaType;
  mediaUrl: string;
  caption: string;
  source: "uploaded" | "manual" | "existing";
  fileName?: string;
  isUploading?: boolean;
  uploadError?: string | null;
};

export function ListingForm({ mode, listingId }: ListingFormProps) {
  const router = useRouter();
  const { session } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  const [mediaItems, setMediaItems] = useState<ListingMediaDraft[]>([]);
  const isUploadingMedia = mediaItems.some((item) => item.isUploading);

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
          setMediaItems(
            existingListing.media.length > 0
              ? existingListing.media.map((item) => ({
                  clientId: item.id,
                  mediaType: item.mediaType,
                  mediaUrl: item.mediaUrl,
                  caption: item.caption ?? "",
                  source: "existing" as const,
                }))
              : [],
          );
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

  function updateMediaItem(index: number, field: "mediaType" | "mediaUrl" | "caption", value: string) {
    setMediaItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addManualMediaItem() {
    setMediaItems((current) => [
      ...current,
      {
        clientId: crypto.randomUUID(),
        mediaType: "IMAGE",
        mediaUrl: "",
        caption: "",
        source: "manual",
      },
    ]);
  }

  function removeMediaItem(index: number) {
    setMediaItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleMediaFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setErrorMessage(null);

    for (const file of files) {
      const clientId = crypto.randomUUID();
      setMediaItems((current) => [
        ...current,
        {
          clientId,
          mediaType: "IMAGE",
          mediaUrl: "",
          caption: file.name.replace(/\.[^.]+$/, ""),
          source: "uploaded",
          fileName: file.name,
          isUploading: true,
          uploadError: null,
        },
      ]);

      try {
        const uploaded = await uploadListingImage(file);
        setMediaItems((current) =>
          current.map((item) =>
            item.clientId === clientId
              ? {
                  ...item,
                  mediaUrl: uploaded.mediaUrl,
                  mediaType: uploaded.mediaType,
                  fileName: uploaded.fileName,
                  isUploading: false,
                  uploadError: null,
                }
              : item,
          ),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to upload image.";
        setMediaItems((current) =>
          current.map((item) =>
            item.clientId === clientId
              ? {
                  ...item,
                  isUploading: false,
                  uploadError: message,
                }
              : item,
          ),
        );
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    if (isUploadingMedia) {
      setErrorMessage("Wait for media uploads to finish before saving the listing.");
      setIsSaving(false);
      return;
    }

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
        media: mediaItems
          .filter((item) => item.mediaUrl.trim().length > 0)
          .map((item) => ({
            mediaType: item.mediaType,
            mediaUrl: item.mediaUrl.trim(),
            caption: item.caption.trim() || undefined,
          })),
      };

      const listing =
        mode === "create"
          ? await createListing(payload)
          : await updateListing(listingId!, payload);

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

    if (isUploadingMedia) {
      setErrorMessage("Wait for media uploads to finish before publishing the listing.");
      setIsSaving(false);
      return;
    }

    try {
      await publishListing(listingId);
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={handleMediaFilesSelected}
      />
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Chip label={mode === "create" ? "New rental" : "Listing workspace"} color="secondary" sx={{ width: "fit-content" }} />
          <Typography variant="h3">{mode === "create" ? "Create listing" : "Edit listing"}</Typography>
          <Typography color="text.secondary">
            Create a clear rental listing with pricing, location, amenities, images, and AI-assisted description support.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading || isSaving} />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required multiline minRows={4} disabled={isLoading || isSaving} />

          <AiDescriptionAssist
            title={title}
            description={description}
            city={city}
            area={area}
            houseType={houseType}
            bedrooms={Number(bedrooms)}
            bathrooms={Number(bathrooms)}
            availabilityStatus={availabilityStatus}
            furnished={furnished}
            rentAmount={Number(rentAmount || 0)}
            selectedAmenityIds={selectedAmenityIds}
            amenities={amenities}
            onApply={setDescription}
          />

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

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={700}>Listing media</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isSaving || isUploadingMedia}
                >
                  Upload images
                </Button>
                <Button type="button" variant="outlined" onClick={addManualMediaItem} disabled={isLoading || isSaving || isUploadingMedia}>
                  Add external URL
                </Button>
              </Stack>
            </Stack>
            <Typography color="text.secondary">
              Upload JPG, PNG, or WebP images for the main gallery. External image or video URLs are still available as a secondary path.
            </Typography>
            {mediaItems.length === 0 ? (
              <Alert severity="info">No media attached yet. Upload at least one image to make the listing feel complete.</Alert>
            ) : null}
            {mediaItems.map((item, index) => (
              <Paper key={item.clientId} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={1} justifyContent="space-between">
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        label={
                          item.source === "uploaded"
                            ? "Uploaded image"
                            : item.source === "manual"
                              ? "External media URL"
                              : "Existing media"
                        }
                        color={item.source === "manual" ? "default" : "secondary"}
                        size="small"
                      />
                      {item.isUploading ? <Chip label="Uploading..." color="warning" size="small" /> : null}
                      {item.uploadError ? <Chip label="Upload failed" color="error" size="small" /> : null}
                    </Stack>
                    <Button
                      type="button"
                      variant="text"
                      color="error"
                      onClick={() => removeMediaItem(index)}
                      disabled={isLoading || isSaving || item.isUploading}
                    >
                      Remove
                    </Button>
                  </Stack>
                  {item.mediaUrl ? (
                    item.mediaType === "IMAGE" ? (
                      <Paper
                        variant="outlined"
                        sx={{ overflow: "hidden", borderRadius: 3, backgroundColor: "grey.100" }}
                      >
                        <Box
                          component="img"
                          src={item.mediaUrl}
                          alt={item.caption || title || "Listing media"}
                          sx={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }}
                        />
                      </Paper>
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{ overflow: "hidden", borderRadius: 3, backgroundColor: "grey.100" }}
                      >
                        <Box
                          component="video"
                          src={item.mediaUrl}
                          controls
                          sx={{ width: "100%", maxHeight: 260, display: "block" }}
                        />
                      </Paper>
                    )
                  ) : null}
                  <Grid container spacing={2}>
                    {item.source === "manual" ? (
                      <>
                        <Grid size={{ xs: 12, md: 3 }}>
                          <TextField
                            select
                            SelectProps={{ native: true }}
                            label="Type"
                            value={item.mediaType}
                            onChange={(event) => updateMediaItem(index, "mediaType", event.target.value)}
                            fullWidth
                            disabled={isLoading || isSaving || item.isUploading}
                          >
                            {mediaTypes.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }}>
                          <TextField
                            label="External media URL"
                            value={item.mediaUrl}
                            onChange={(event) => updateMediaItem(index, "mediaUrl", event.target.value)}
                            fullWidth
                            disabled={isLoading || isSaving || item.isUploading}
                            helperText="Use this only if you already host the media elsewhere."
                          />
                        </Grid>
                      </>
                    ) : (
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="Stored media URL"
                          value={item.mediaUrl}
                          fullWidth
                          disabled
                          helperText={item.fileName ? `Stored as ${item.fileName}` : "Uploaded media ready for this listing."}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <TextField
                    label="Caption"
                    value={item.caption}
                    onChange={(event) => updateMediaItem(index, "caption", event.target.value)}
                    fullWidth
                    disabled={isLoading || isSaving || item.isUploading}
                  />
                  {item.uploadError ? <Alert severity="error">{item.uploadError}</Alert> : null}
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={isLoading || isSaving || isUploadingMedia}>
              {isSaving ? "Saving..." : mode === "create" ? "Create draft" : "Save changes"}
            </Button>
            {mode === "edit" ? (
              <Button type="button" variant="outlined" onClick={handlePublish} disabled={isLoading || isSaving || isUploadingMedia}>
                Publish
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
