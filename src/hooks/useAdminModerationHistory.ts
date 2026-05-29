import { useCallback } from "react";
import { getRecentModerationActions } from "@/lib/api/admin";
import type { AdminModerationAction } from "@/types/domain";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY: AdminModerationAction[] = [];

export function useAdminModerationHistory(limit = 12, enabled = true) {
  const fetcher = useCallback(() => getRecentModerationActions(limit), [limit]);
  const { data, loading, error, refetch } = useAsyncResource<
    AdminModerationAction[]
  >(fetcher, EMPTY, enabled);
  return { actions: data, loading, error, refetch };
}
