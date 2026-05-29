import { useCallback } from "react";
import { getSuggestedListings } from "@/lib/api/suggestions";
import type { ListingSuggestion } from "@/types/domain";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY: ListingSuggestion[] = [];

export function useSuggestedListings(limit = 3, enabled = true) {
  const fetcher = useCallback(() => getSuggestedListings(limit), [limit]);
  const { data, loading, error, refetch } = useAsyncResource<
    ListingSuggestion[]
  >(fetcher, EMPTY, enabled);
  return { suggestions: data, loading, error, refetch };
}
