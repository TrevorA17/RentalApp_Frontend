import client from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { Report } from "@/types/domain";

export type CreateReportPayload = {
  listingId?: string;
  reportedUserId?: string;
  reason: string;
  details?: string;
};

export async function createReport(
  payload: CreateReportPayload,
): Promise<Report> {
  const res = await client.post<ApiSuccessResponse<Report>>(
    "/reports",
    payload,
    { meta: { auth: "required" } },
  );
  return res.data.data;
}
