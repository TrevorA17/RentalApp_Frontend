import { apiRequest } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { AgentRecommendation } from "@/types/domain";

export type CreateAgentRecommendationRequest = {
  rating: number;
  comment: string;
};

export async function getAgentRecommendations(agentUserId: string) {
  const response = await apiRequest<ApiSuccessResponse<AgentRecommendation[]>>(
    `/agents/${agentUserId}/recommendations`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  return response.data;
}

export async function createAgentRecommendation(
  agentUserId: string,
  payload: CreateAgentRecommendationRequest,
) {
  const response = await apiRequest<ApiSuccessResponse<AgentRecommendation>>(
    `/agents/${agentUserId}/recommendations`,
    {
      method: "POST",
      auth: "required",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}
