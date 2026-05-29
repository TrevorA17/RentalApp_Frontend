import * as yup from "yup";

export const inquirySchema = yup.object({
  message: yup
    .string()
    .trim()
    .min(1, "Enter a short message before sending the inquiry.")
    .max(2000, "Inquiry message must be at most 2000 characters")
    .required("Enter a short message before sending the inquiry."),
});

export type InquiryFormValues = yup.InferType<typeof inquirySchema>;
