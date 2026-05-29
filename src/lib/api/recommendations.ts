import client from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/types/api";
import type { AgentRecommendation } from "@/types/domain";

export type CreateAgentRecommendationRequest = {
  rating: number;
  comment: string;
};

export async function getAgentRecommendations(
  agentUserId: string,
): Promise<AgentRecommendation[]> {
  const res = await client.get<ApiSuccessResponse<AgentRecommendation[]>>(
    `/agents/${agentUserId}/recommendations`,
  );
  return res.data.data;
}

export async function createAgentRecommendation(
  agentUserId: string,
  payload: CreateAgentRecommendationRequest,
): Promise<AgentRecommendation> {
  const res = await client.post<ApiSuccessResponse<AgentRecommendation>>(
    `/agents/${agentUserId}/recommendations`,
    payload,
    { meta: { auth: "required" } },
  );
  return res.data.data;
}
