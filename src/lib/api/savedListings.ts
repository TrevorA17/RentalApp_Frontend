import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { ListingSummary } from "@/types/domain";

export async function getSavedListings(token: string) {
  const response = await apiRequest<ApiSuccessResponse<ListingSummary[]>>("/saved-listings", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function getSavedListingIds(token: string) {
  const response = await apiRequest<ApiSuccessResponse<string[]>>("/saved-listings/ids", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function saveListing(token: string, listingId: string) {
  await apiRequest<ApiSuccessResponse<null>>(`/listings/${listingId}/save`, {
    method: "POST",
    token,
  });
}

export async function removeSavedListing(token: string, listingId: string) {
  await apiRequest<ApiSuccessResponse<null>>(`/listings/${listingId}/save`, {
    method: "DELETE",
    token,
  });
}
