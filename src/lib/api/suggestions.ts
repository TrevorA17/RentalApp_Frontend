import client from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { ListingSuggestion } from "@/types/domain";

export async function getSuggestedListings(
  limit = 3,
): Promise<ListingSuggestion[]> {
  const res = await client.get<ApiSuccessResponse<ListingSuggestion[]>>(
    "/suggestions/listings",
    { params: { limit }, meta: { auth: "required" } },
  );
  return res.data.data;
}
