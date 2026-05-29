import * as yup from "yup";

export const recommendationSchema = yup.object({
  rating: yup
    .number()
    .integer("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .required("Rating is required"),
  comment: yup
    .string()
    .trim()
    .min(1, "Recommendation comment is required")
    .max(1000, "Recommendation must be at most 1000 characters")
    .required("Recommendation comment is required"),
});

export type RecommendationFormValues = yup.InferType<
  typeof recommendationSchema
>;
