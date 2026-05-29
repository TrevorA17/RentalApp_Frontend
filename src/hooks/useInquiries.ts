import { useCallback } from "react";
import { getReceivedInquiries, getSentInquiries } from "@/lib/api/inquiries";
import type { Inquiry } from "@/types/domain";
import { useAsyncResource } from "./useAsyncResource";

const EMPTY: Inquiry[] = [];

export function useSentInquiries(enabled = true) {
  const fetcher = useCallback(() => getSentInquiries(), []);
  const { data, loading, error, refetch } = useAsyncResource<Inquiry[]>(
    fetcher,
    EMPTY,
    enabled,
  );
  return { inquiries: data, loading, error, refetch };
}

export function useReceivedInquiries(enabled = true) {
  const fetcher = useCallback(() => getReceivedInquiries(), []);
  const { data, loading, error, refetch } = useAsyncResource<Inquiry[]>(
    fetcher,
    EMPTY,
    enabled,
  );
  return { inquiries: data, loading, error, refetch };
}
