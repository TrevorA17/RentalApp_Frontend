import { apiRequest } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { ListingSuggestion } from "@/types/domain";

export async function getSuggestedListings(limit = 3) {
  const response = await apiRequest<ApiSuccessResponse<ListingSuggestion[]>>(
    `/suggestions/listings?limit=${limit}`,
    {
      method: "GET",
      auth: "required",
      cache: "no-store",
    },
  );

  return response.data;
}
