import { useCallback } from "react";
import { getAdminRecommendations } from "@/lib/api/admin";
import type { AdminAgentRecommendation } from "@/types/domain";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY: AdminAgentRecommendation[] = [];

export function useAdminRecommendations(enabled = true) {
  const fetcher = useCallback(() => getAdminRecommendations(), []);
  const { data, loading, error, refetch } = useAsyncResource<
    AdminAgentRecommendation[]
  >(fetcher, EMPTY, enabled);
  return { recommendations: data, loading, error, refetch };
}
