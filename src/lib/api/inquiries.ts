import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { Inquiry, InquiryStatus } from "@/types/domain";

export type CreateInquiryPayload = {
  message: string;
};

export async function createInquiry(listingId: string, payload: CreateInquiryPayload) {
  const response = await apiRequest<ApiSuccessResponse<Inquiry>>(`/listings/${listingId}/inquiries`, {
    method: "POST",
    auth: "required",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function getSentInquiries() {
  const response = await apiRequest<ApiSuccessResponse<Inquiry[]>>("/inquiries/sent", {
    method: "GET",
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function getReceivedInquiries() {
  const response = await apiRequest<ApiSuccessResponse<Inquiry[]>>("/inquiries/received", {
    method: "GET",
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus) {
  const response = await apiRequest<ApiSuccessResponse<Inquiry>>(`/inquiries/${inquiryId}/status`, {
    method: "PATCH",
    auth: "required",
    body: JSON.stringify({ status }),
  });

  return response.data;
}
