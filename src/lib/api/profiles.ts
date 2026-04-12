import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { Profile } from "@/types/domain";

export type ProfileUpsertRequest = {
  fullName: string;
  phoneNumber?: string;
  bio?: string;
  profilePhotoUrl?: string;
  city?: string;
  serviceAreas?: string[];
  companyName?: string;
  feeStructure?: string;
};

export async function getMyProfile() {
  const response = await apiRequest<ApiSuccessResponse<Profile>>("/profiles/me", {
    method: "GET",
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function saveMyProfile(payload: ProfileUpsertRequest) {
  const response = await apiRequest<ApiSuccessResponse<Profile>>("/profiles/me", {
    method: "PUT",
    auth: "required",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function getPublicProfile(userId: string) {
  const response = await apiRequest<ApiSuccessResponse<Profile>>(`/profiles/${userId}`, {
    method: "GET",
    cache: "no-store",
  });

  return response.data;
}
