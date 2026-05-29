import client from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { Inquiry, InquiryStatus } from "@/types/domain";

export type CreateInquiryPayload = {
  message: string;
};

export async function createInquiry(
  listingId: string,
  payload: CreateInquiryPayload,
): Promise<Inquiry> {
  const res = await client.post<ApiSuccessResponse<Inquiry>>(
    `/listings/${listingId}/inquiries`,
    payload,
    { meta: { auth: "required" } },
  );
  return res.data.data;
}

export async function getSentInquiries(): Promise<Inquiry[]> {
  const res = await client.get<ApiSuccessResponse<Inquiry[]>>(
    "/inquiries/sent",
    { meta: { auth: "required" } },
  );
  return res.data.data;
}

export async function getReceivedInquiries(): Promise<Inquiry[]> {
  const res = await client.get<ApiSuccessResponse<Inquiry[]>>(
    "/inquiries/received",
    { meta: { auth: "required" } },
  );
  return res.data.data;
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus,
): Promise<Inquiry> {
  const res = await client.patch<ApiSuccessResponse<Inquiry>>(
    `/inquiries/${inquiryId}/status`,
    { status },
    { meta: { auth: "required" } },
  );
  return res.data.data;
}
