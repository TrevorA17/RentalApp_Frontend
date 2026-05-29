import * as yup from "yup";

export const reportSchema = yup.object({
  reason: yup.string().trim().required("Reason is required"),
  details: yup
    .string()
    .trim()
    .max(2000, "Details must be at most 2000 characters")
    .default(""),
});

export type ReportFormValues = yup.InferType<typeof reportSchema>;
