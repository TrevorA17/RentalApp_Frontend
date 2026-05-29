import client from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { ListingSummary } from "@/types/domain";

const authed = { meta: { auth: "required" as const } };

export async function getSavedListings(): Promise<ListingSummary[]> {
  const res = await client.get<ApiSuccessResponse<ListingSummary[]>>(
    "/saved-listings",
    authed,
  );
  return res.data.data;
}

export async function getSavedListingIds(): Promise<string[]> {
  const res = await client.get<ApiSuccessResponse<string[]>>(
    "/saved-listings/ids",
    authed,
  );
  return res.data.data;
}

export async function saveListing(listingId: string): Promise<void> {
  await client.post<ApiSuccessResponse<null>>(
    `/listings/${listingId}/save`,
    undefined,
    authed,
  );
}

export async function removeSavedListing(listingId: string): Promise<void> {
  await client.delete<ApiSuccessResponse<null>>(
    `/listings/${listingId}/save`,
    authed,
  );
}
