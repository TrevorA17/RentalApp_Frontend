import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { AdminListing, AdminUser, ApprovalStatus, Report, ReportStatus, UserStatus } from "@/types/domain";

export async function getAdminListings() {
  const response = await apiRequest<ApiSuccessResponse<AdminListing[]>>("/admin/listings", {
    method: "GET",
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function updateAdminListingApproval(listingId: string, approvalStatus: ApprovalStatus) {
  const response = await apiRequest<ApiSuccessResponse<AdminListing>>(`/admin/listings/${listingId}/approval`, {
    method: "PATCH",
    auth: "required",
    body: JSON.stringify({ approvalStatus }),
  });

  return response.data;
}

export async function getAdminReports() {
  const response = await apiRequest<ApiSuccessResponse<Report[]>>("/admin/reports", {
    method: "GET",
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function updateAdminReportStatus(reportId: string, status: ReportStatus) {
  const response = await apiRequest<ApiSuccessResponse<Report>>(`/admin/reports/${reportId}/status`, {
    method: "PATCH",
    auth: "required",
    body: JSON.stringify({ status }),
  });

  return response.data;
}

export async function getAdminUsers() {
  const response = await apiRequest<ApiSuccessResponse<AdminUser[]>>("/admin/users", {
    method: "GET",
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function updateAdminUserStatus(userId: string, status: UserStatus) {
  const response = await apiRequest<ApiSuccessResponse<AdminUser>>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    auth: "required",
    body: JSON.stringify({ status }),
  });

  return response.data;
}
