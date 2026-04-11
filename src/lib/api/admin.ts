import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { AdminListing, AdminUser, ApprovalStatus, Report, ReportStatus, UserStatus } from "@/types/domain";

export async function getAdminListings(token: string) {
  const response = await apiRequest<ApiSuccessResponse<AdminListing[]>>("/admin/listings", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function updateAdminListingApproval(token: string, listingId: string, approvalStatus: ApprovalStatus) {
  const response = await apiRequest<ApiSuccessResponse<AdminListing>>(`/admin/listings/${listingId}/approval`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ approvalStatus }),
  });

  return response.data;
}

export async function getAdminReports(token: string) {
  const response = await apiRequest<ApiSuccessResponse<Report[]>>("/admin/reports", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function updateAdminReportStatus(token: string, reportId: string, status: ReportStatus) {
  const response = await apiRequest<ApiSuccessResponse<Report>>(`/admin/reports/${reportId}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });

  return response.data;
}

export async function getAdminUsers(token: string) {
  const response = await apiRequest<ApiSuccessResponse<AdminUser[]>>("/admin/users", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function updateAdminUserStatus(token: string, userId: string, status: UserStatus) {
  const response = await apiRequest<ApiSuccessResponse<AdminUser>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });

  return response.data;
}
