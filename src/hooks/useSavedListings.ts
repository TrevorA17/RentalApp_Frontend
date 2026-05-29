import { useCallback } from "react";
import { getSavedListingIds, getSavedListings } from "@/lib/api/savedListings";
import type { ListingSummary } from "@/types/domain";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY_LISTINGS: ListingSummary[] = [];
const EMPTY_IDS: string[] = [];

export function useSavedListings(enabled = true) {
  const fetcher = useCallback(() => getSavedListings(), []);
  const { data, loading, error, refetch } = useAsyncResource<ListingSummary[]>(
    fetcher,
    EMPTY_LISTINGS,
    enabled,
  );
  return { savedListings: data, loading, error, refetch };
}

export function useSavedListingIds(enabled = true) {
  const fetcher = useCallback(() => getSavedListingIds(), []);
  const { data, loading, error, refetch } = useAsyncResource<string[]>(
    fetcher,
    EMPTY_IDS,
    enabled,
  );
  return { savedIds: data, loading, error, refetch };
}
