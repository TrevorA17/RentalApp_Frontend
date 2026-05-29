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
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { AiDescriptionAssist } from "@/features/ai/AiDescriptionAssist";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAmenities } from "@/hooks/useAmenities";
import { extractApiError } from "@/lib/api/client";
import {
  createListing,
  getListingById,
  publishListing,
  updateListing,
  uploadListingImage,
} from "@/lib/api/listings";
import type {
  AvailabilityStatus,
  HouseType,
  ListingSummary,
  MediaType,
} from "@/types/domain";
import { type ListingFormValues, listingSchema } from "@/validations/listing";

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

const initialValues: ListingFormValues = {
  title: "",
  description: "",
  rentAmount: "",
  depositAmount: "",
  agentFeeAmount: "",
  city: "",
  area: "",
  bedrooms: "1",
  bathrooms: "1",
  houseType: "APARTMENT",
  furnished: false,
  availabilityStatus: "AVAILABLE_NOW",
};

export function ListingForm({ mode, listingId }: ListingFormProps) {
  const router = useRouter();
  const { session } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { amenities } = useAmenities();
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState<ListingMediaDraft[]>([]);
  const isUploadingMedia = mediaItems.some((item) => item.isUploading);

  const formik = useFormik<ListingFormValues>({
    initialValues,
    validationSchema: listingSchema,
    enableReinitialize: false,
    onSubmit: async (values) => {
      setErrorMessage(null);
      setSuccessMessage(null);

      if (isUploadingMedia) {
        setErrorMessage(
          "Wait for media uploads to finish before saving the listing.",
        );
        return;
      }

      try {
        const payload = {
          title: values.title,
          description: values.description,
          rentAmount: Number(values.rentAmount),
          depositAmount: values.depositAmount
            ? Number(values.depositAmount)
            : undefined,
          agentFeeAmount: values.agentFeeAmount
            ? Number(values.agentFeeAmount)
            : undefined,
          city: values.city,
          area: values.area,
          bedrooms: Number(values.bedrooms),
          bathrooms: Number(values.bathrooms),
          houseType: values.houseType,
          furnished: values.furnished,
          availabilityStatus: values.availabilityStatus,
          amenityIds: selectedAmenityIds,
          media: mediaItems
            .filter((item) => item.mediaUrl.trim().length > 0)
            .map((item) => ({
              mediaType: item.mediaType,
              mediaUrl: item.mediaUrl.trim(),
              caption: item.caption.trim() || undefined,
            })),
        };

        let listing: ListingSummary;
        if (mode === "create") {
          listing = await createListing(payload);
        } else {
          if (!listingId) {
            throw new Error("Missing listing id for edit.");
          }
          listing = await updateListing(listingId, payload);
        }

        setSuccessMessage(
          mode === "create" ? "Listing draft created." : "Listing updated.",
        );
        router.replace(`/my-listings/${listing.id}/edit`);
      } catch (error) {
        setErrorMessage(extractApiError(error));
      }
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-shot load
  useEffect(() => {
    async function loadData() {
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const existingListing =
          mode === "edit" && listingId
            ? await getListingById(listingId, session.accessToken)
            : null;

        if (existingListing) {
          formik.resetForm({
            values: {
              title: existingListing.title,
              description: existingListing.description,
              rentAmount: String(existingListing.rentAmount),
              depositAmount: existingListing.depositAmount
                ? String(existingListing.depositAmount)
                : "",
              agentFeeAmount: existingListing.agentFeeAmount
                ? String(existingListing.agentFeeAmount)
                : "",
              city: existingListing.city,
              area: existingListing.area,
              bedrooms: String(existingListing.bedrooms),
              bathrooms: String(existingListing.bathrooms),
              houseType: existingListing.houseType,
              furnished: existingListing.furnished,
              availabilityStatus: existingListing.availabilityStatus,
            },
          });
          setSelectedAmenityIds(
            existingListing.amenities.map((amenity) => amenity.id),
          );
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
        setErrorMessage(extractApiError(error));
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
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function updateMediaItem(
    index: number,
    field: "mediaType" | "mediaUrl" | "caption",
    value: string,
  ) {
    setMediaItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
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
    setMediaItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function handleMediaFilesSelected(
    event: ChangeEvent<HTMLInputElement>,
  ) {
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
        const message = extractApiError(error);
        setMediaItems((current) =>
          current.map((item) =>
            item.clientId === clientId
              ? { ...item, isUploading: false, uploadError: message }
              : item,
          ),
        );
      }
    }
  }

  async function handlePublish() {
    if (!listingId) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    if (isUploadingMedia) {
      setErrorMessage(
        "Wait for media uploads to finish before publishing the listing.",
      );
      return;
    }

    try {
      await publishListing(listingId);
      setSuccessMessage("Listing published successfully.");
    } catch (error) {
      setErrorMessage(extractApiError(error));
    }
  }

  const disabled = isLoading || formik.isSubmitting;

  function fieldError(name: keyof ListingFormValues): string | undefined {
    const touched = formik.touched[name];
    const error = formik.errors[name];
    return touched && typeof error === "string" ? error : undefined;
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
          <Chip
            label={mode === "create" ? "New rental" : "Listing workspace"}
            color="secondary"
            sx={{ width: "fit-content" }}
          />
          <Typography variant="h3">
            {mode === "create" ? "Create listing" : "Edit listing"}
          </Typography>
          <Typography color="text.secondary">
            Create a clear rental listing with pricing, location, amenities,
            images, and AI-assisted description support.
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack component="form" spacing={2.5} onSubmit={formik.handleSubmit}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          {successMessage ? (
            <Alert severity="success">{successMessage}</Alert>
          ) : null}

          <TextField
            label="Title"
            required
            disabled={disabled}
            {...formik.getFieldProps("title")}
            error={Boolean(fieldError("title"))}
            helperText={fieldError("title")}
          />
          <TextField
            label="Description"
            required
            multiline
            minRows={4}
            disabled={disabled}
            {...formik.getFieldProps("description")}
            error={Boolean(fieldError("description"))}
            helperText={fieldError("description")}
          />

          <AiDescriptionAssist
            title={formik.values.title}
            description={formik.values.description}
            city={formik.values.city}
            area={formik.values.area}
            houseType={formik.values.houseType as HouseType}
            bedrooms={Number(formik.values.bedrooms) || 0}
            bathrooms={Number(formik.values.bathrooms) || 0}
            availabilityStatus={
              formik.values.availabilityStatus as AvailabilityStatus
            }
            furnished={formik.values.furnished}
            rentAmount={Number(formik.values.rentAmount || 0)}
            selectedAmenityIds={selectedAmenityIds}
            amenities={amenities}
            onApply={(value) => formik.setFieldValue("description", value)}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Rent amount"
                type="number"
                required
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("rentAmount")}
                error={Boolean(fieldError("rentAmount"))}
                helperText={fieldError("rentAmount")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Deposit amount"
                type="number"
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("depositAmount")}
                error={Boolean(fieldError("depositAmount"))}
                helperText={fieldError("depositAmount")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Agent fee amount"
                type="number"
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("agentFeeAmount")}
                error={Boolean(fieldError("agentFeeAmount"))}
                helperText={fieldError("agentFeeAmount")}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="City"
                required
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("city")}
                error={Boolean(fieldError("city"))}
                helperText={fieldError("city")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Area / neighborhood"
                required
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("area")}
                error={Boolean(fieldError("area"))}
                helperText={fieldError("area")}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Bedrooms"
                type="number"
                required
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("bedrooms")}
                error={Boolean(fieldError("bedrooms"))}
                helperText={fieldError("bedrooms")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="Bathrooms"
                type="number"
                required
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("bathrooms")}
                error={Boolean(fieldError("bathrooms"))}
                helperText={fieldError("bathrooms")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                label="House type"
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("houseType")}
              >
                {houseTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                label="Availability"
                fullWidth
                disabled={disabled}
                {...formik.getFieldProps("availabilityStatus")}
              >
                {availabilityStatuses.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.furnished}
                onChange={(e) =>
                  formik.setFieldValue("furnished", e.target.checked)
                }
              />
            }
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
                        disabled={disabled}
                      />
                    }
                    label={amenity.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>

          <Stack spacing={1.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={700}>Listing media</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isUploadingMedia}
                >
                  Upload images
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={addManualMediaItem}
                  disabled={disabled || isUploadingMedia}
                >
                  Add external URL
                </Button>
              </Stack>
            </Stack>
            <Typography color="text.secondary">
              Upload JPG, PNG, or WebP images for the main gallery. External
              image or video URLs are still available as a secondary path.
            </Typography>
            {mediaItems.length === 0 ? (
              <Alert severity="info">
                No media attached yet. Upload at least one image to make the
                listing feel complete.
              </Alert>
            ) : null}
            {mediaItems.map((item, index) => (
              <Paper key={item.clientId} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Chip
                        label={
                          item.source === "uploaded"
                            ? "Uploaded image"
                            : item.source === "manual"
                              ? "External media URL"
                              : "Existing media"
                        }
                        color={
                          item.source === "manual" ? "default" : "secondary"
                        }
                        size="small"
                      />
                      {item.isUploading ? (
                        <Chip
                          label="Uploading..."
                          color="warning"
                          size="small"
                        />
                      ) : null}
                      {item.uploadError ? (
                        <Chip
                          label="Upload failed"
                          color="error"
                          size="small"
                        />
                      ) : null}
                    </Stack>
                    <Button
                      type="button"
                      variant="text"
                      color="error"
                      onClick={() => removeMediaItem(index)}
                      disabled={disabled || item.isUploading}
                    >
                      Remove
                    </Button>
                  </Stack>
                  {item.mediaUrl ? (
                    item.mediaType === "IMAGE" ? (
                      <Paper
                        variant="outlined"
                        sx={{
                          overflow: "hidden",
                          borderRadius: 3,
                          backgroundColor: "grey.100",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.mediaUrl}
                          alt={
                            item.caption ||
                            formik.values.title ||
                            "Listing media"
                          }
                          sx={{
                            width: "100%",
                            maxHeight: 260,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Paper>
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{
                          overflow: "hidden",
                          borderRadius: 3,
                          backgroundColor: "grey.100",
                        }}
                      >
                        <Box
                          component="video"
                          src={item.mediaUrl}
                          controls
                          sx={{
                            width: "100%",
                            maxHeight: 260,
                            display: "block",
                          }}
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
                            onChange={(event) =>
                              updateMediaItem(
                                index,
                                "mediaType",
                                event.target.value,
                              )
                            }
                            fullWidth
                            disabled={disabled || item.isUploading}
                          >
                            {mediaTypes.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }}>
                          <TextField
                            label="External media URL"
                            value={item.mediaUrl}
                            onChange={(event) =>
                              updateMediaItem(
                                index,
                                "mediaUrl",
                                event.target.value,
                              )
                            }
                            fullWidth
                            disabled={disabled || item.isUploading}
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
                          helperText={
                            item.fileName
                              ? `Stored as ${item.fileName}`
                              : "Uploaded media ready for this listing."
                          }
                        />
                      </Grid>
                    )}
                  </Grid>
                  <TextField
                    label="Caption"
                    value={item.caption}
                    onChange={(event) =>
                      updateMediaItem(index, "caption", event.target.value)
                    }
                    fullWidth
                    disabled={disabled || item.isUploading}
                  />
                  {item.uploadError ? (
                    <Alert severity="error">{item.uploadError}</Alert>
                  ) : null}
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={disabled || isUploadingMedia}
            >
              {formik.isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create draft"
                  : "Save changes"}
            </Button>
            {mode === "edit" ? (
              <Button
                type="button"
                variant="outlined"
                onClick={handlePublish}
                disabled={disabled || isUploadingMedia}
              >
                Publish
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
