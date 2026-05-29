import client from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  AdminAgentRecommendation,
  AdminListing,
  AdminModerationAction,
  AdminUser,
  ApprovalStatus,
  Report,
  ReportStatus,
  UserStatus,
} from "@/types/domain";

const authed = { meta: { auth: "required" as const } };

export async function getAdminListings(): Promise<AdminListing[]> {
  const res = await client.get<ApiSuccessResponse<AdminListing[]>>(
    "/admin/listings",
    authed,
  );
  return res.data.data;
}

export async function updateAdminListingApproval(
  listingId: string,
  approvalStatus: ApprovalStatus,
): Promise<AdminListing> {
  const res = await client.patch<ApiSuccessResponse<AdminListing>>(
    `/admin/listings/${listingId}/approval`,
    { approvalStatus },
    authed,
  );
  return res.data.data;
}

export async function getAdminReports(): Promise<Report[]> {
  const res = await client.get<ApiSuccessResponse<Report[]>>(
    "/admin/reports",
    authed,
  );
  return res.data.data;
}

export async function updateAdminReportStatus(
  reportId: string,
  status: ReportStatus,
): Promise<Report> {
  const res = await client.patch<ApiSuccessResponse<Report>>(
    `/admin/reports/${reportId}/status`,
    { status },
    authed,
  );
  return res.data.data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await client.get<ApiSuccessResponse<AdminUser[]>>(
    "/admin/users",
    authed,
  );
  return res.data.data;
}

export async function updateAdminUserStatus(
  userId: string,
  status: UserStatus,
): Promise<AdminUser> {
  const res = await client.patch<ApiSuccessResponse<AdminUser>>(
    `/admin/users/${userId}/status`,
    { status },
    authed,
  );
  return res.data.data;
}

export async function getAdminRecommendations(): Promise<
  AdminAgentRecommendation[]
> {
  const res = await client.get<ApiSuccessResponse<AdminAgentRecommendation[]>>(
    "/admin/recommendations",
    authed,
  );
  return res.data.data;
}

export async function updateAdminRecommendationApproval(
  recommendationId: string,
  approvalStatus: ApprovalStatus,
): Promise<AdminAgentRecommendation> {
  const res = await client.patch<ApiSuccessResponse<AdminAgentRecommendation>>(
    `/admin/recommendations/${recommendationId}/approval`,
    { approvalStatus },
    authed,
  );
  return res.data.data;
}

export async function getRecentModerationActions(
  limit = 12,
): Promise<AdminModerationAction[]> {
  const res = await client.get<ApiSuccessResponse<AdminModerationAction[]>>(
    "/admin/moderation-actions",
    { ...authed, params: { limit } },
  );
  return res.data.data;
}
