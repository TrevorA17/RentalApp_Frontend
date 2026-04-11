import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { ListingSuggestion } from "@/types/domain";

export async function getSuggestedListings(token: string, limit = 3) {
  const response = await apiRequest<ApiSuccessResponse<ListingSuggestion[]>>(`/suggestions/listings?limit=${limit}`, {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}
