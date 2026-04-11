import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { Report } from "@/types/domain";

export type CreateReportPayload = {
  listingId?: string;
  reportedUserId?: string;
  reason: string;
  details?: string;
};

export async function createReport(token: string, payload: CreateReportPayload) {
  const response = await apiRequest<ApiSuccessResponse<Report>>("/reports", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });

  return response.data;
}
