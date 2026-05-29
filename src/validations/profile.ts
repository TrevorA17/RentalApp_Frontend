import * as yup from "yup";

export const profileSchema = yup.object({
  fullName: yup.string().trim().required("Full name is required"),
  phoneNumber: yup.string().trim().default(""),
  bio: yup.string().trim().default(""),
  city: yup.string().trim().default(""),
  serviceAreas: yup.string().trim().default(""),
  companyName: yup.string().trim().default(""),
  feeStructure: yup.string().trim().default(""),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
