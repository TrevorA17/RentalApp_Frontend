import * as yup from "yup";

const houseTypes = [
  "APARTMENT",
  "BEDSITTER",
  "STUDIO",
  "MAISONETTE",
  "BUNGALOW",
  "HOUSE",
  "TOWNHOUSE",
] as const;

const availabilityStatuses = [
  "AVAILABLE_NOW",
  "AVAILABLE_SOON",
  "OCCUPIED",
] as const;

// Numeric inputs stay as strings in form state; the schema validates the shape
// (positive integer / positive decimal) and the submit handler does the final
// Number() coercion before calling the API.
const positiveAmount = yup
  .string()
  .trim()
  .matches(/^\d+(\.\d+)?$/, "Must be a positive number")
  .required("Required");

const optionalAmount = yup
  .string()
  .trim()
  .matches(/^(\d+(\.\d+)?)?$/, "Must be a positive number")
  .default("");

const positiveInteger = yup
  .string()
  .trim()
  .matches(/^\d+$/, "Must be a whole number")
  .required("Required");

export const listingSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .required("Title is required"),
  description: yup
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),
  rentAmount: positiveAmount,
  depositAmount: optionalAmount,
  agentFeeAmount: optionalAmount,
  city: yup.string().trim().required("City is required"),
  area: yup.string().trim().required("Area is required"),
  bedrooms: positiveInteger,
  bathrooms: positiveInteger,
  houseType: yup
    .string()
    .oneOf(houseTypes, "Invalid house type")
    .required("House type is required"),
  furnished: yup.boolean().required(),
  availabilityStatus: yup
    .string()
    .oneOf(availabilityStatuses, "Invalid availability status")
    .required("Availability status is required"),
});

export type ListingFormValues = yup.InferType<typeof listingSchema>;
