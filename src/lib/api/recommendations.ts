import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { ListingSummary } from "@/types/domain";

export type Recommendation = {
  listing: ListingSummary;
  reason: string;
  score: number;
};

export async function getRecommendations(token: string, limit = 3) {
  const response = await apiRequest<ApiSuccessResponse<Recommendation[]>>(`/recommendations?limit=${limit}`, {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}
