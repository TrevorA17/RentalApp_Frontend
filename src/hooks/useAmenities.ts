import { useCallback } from "react";
import { getAmenities } from "@/lib/api/listings";
import type { Amenity } from "@/types/domain";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY: Amenity[] = [];

export function useAmenities(enabled = true) {
  const fetcher = useCallback(() => getAmenities(), []);
  const { data, loading, error, refetch } = useAsyncResource<Amenity[]>(
    fetcher,
    EMPTY,
    enabled,
  );
  return { amenities: data, loading, error, refetch };
}
