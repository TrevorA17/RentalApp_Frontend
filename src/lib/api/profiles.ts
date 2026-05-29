import client from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { Profile } from "@/types/domain";

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

export async function getMyProfile(): Promise<Profile> {
  const res = await client.get<ApiSuccessResponse<Profile>>("/profiles/me", {
    meta: { auth: "required" },
  });
  return res.data.data;
}

export async function saveMyProfile(
  payload: ProfileUpsertRequest,
): Promise<Profile> {
  const res = await client.put<ApiSuccessResponse<Profile>>(
    "/profiles/me",
    payload,
    { meta: { auth: "required" } },
  );
  return res.data.data;
}

export async function getPublicProfile(userId: string): Promise<Profile> {
  const res = await client.get<ApiSuccessResponse<Profile>>(
    `/profiles/${userId}`,
  );
  return res.data.data;
}
