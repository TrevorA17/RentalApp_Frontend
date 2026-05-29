import { apiRequest } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { ListingSummary } from "@/types/domain";

export async function getSavedListings() {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary[]>>(
    "/saved-listings",
    {
      method: "GET",
      auth: "required",
      cache: "no-store",
    },
  );

  return response.data;
}

export async function getSavedListingIds() {
  const response = await apiRequest<ApiSuccessResponse<string[]>>(
    "/saved-listings/ids",
    {
      method: "GET",
      auth: "required",
      cache: "no-store",
    },
  );

  return response.data;
}

export async function saveListing(listingId: string) {
  await apiRequest<ApiSuccessResponse<null>>(`/listings/${listingId}/save`, {
    method: "POST",
    auth: "required",
  });
}

export async function removeSavedListing(listingId: string) {
  await apiRequest<ApiSuccessResponse<null>>(`/listings/${listingId}/save`, {
    method: "DELETE",
    auth: "required",
  });
}
