import { apiRequest } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { Report } from "@/types/domain";

export type CreateReportPayload = {
  listingId?: string;
  reportedUserId?: string;
  reason: string;
  details?: string;
};

export async function createReport(payload: CreateReportPayload) {
  const response = await apiRequest<ApiSuccessResponse<Report>>("/reports", {
    method: "POST",
    auth: "required",
    body: JSON.stringify(payload),
  });

  return response.data;
}
