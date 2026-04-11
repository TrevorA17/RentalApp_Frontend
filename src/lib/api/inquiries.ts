import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { Inquiry, InquiryStatus } from "@/types/domain";

export type CreateInquiryPayload = {
  message: string;
};

export async function createInquiry(token: string, listingId: string, payload: CreateInquiryPayload) {
  const response = await apiRequest<ApiSuccessResponse<Inquiry>>(`/listings/${listingId}/inquiries`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function getSentInquiries(token: string) {
  const response = await apiRequest<ApiSuccessResponse<Inquiry[]>>("/inquiries/sent", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function getReceivedInquiries(token: string) {
  const response = await apiRequest<ApiSuccessResponse<Inquiry[]>>("/inquiries/received", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function updateInquiryStatus(token: string, inquiryId: string, status: InquiryStatus) {
  const response = await apiRequest<ApiSuccessResponse<Inquiry>>(`/inquiries/${inquiryId}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });

  return response.data;
}
