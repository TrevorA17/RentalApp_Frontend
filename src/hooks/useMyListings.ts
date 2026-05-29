import { useCallback } from "react";
import { getMyListings } from "@/lib/api/listings";
import type { ListingSummary } from "@/types/domain";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY: ListingSummary[] = [];

export function useMyListings(enabled = true) {
  const fetcher = useCallback(() => getMyListings(), []);
  const { data, loading, error, refetch } = useAsyncResource<ListingSummary[]>(
    fetcher,
    EMPTY,
    enabled,
  );
  return { listings: data, loading, error, refetch };
}
