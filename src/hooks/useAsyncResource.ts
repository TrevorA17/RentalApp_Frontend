import { useCallback, useEffect, useState } from "react";
import { extractApiError } from "@/lib/api/client";

interface UseAsyncResourceResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<T>;
}

/**
 * Generic data-fetch hook for one-shot reads from the API. Auto-fetches when
 * `enabled` is true (mount + dep change), exposes a `refetch()` that resolves
 * with the loaded value (or `initial` on error).
 *
 * @param fetcher MUST be `useCallback`-memoised by the caller on its own deps.
 *   This hook re-runs whenever the `fetcher` identity changes — an unstable
 *   reference will infinite-loop.
 * @param initial Stable identity per call site (hoist arrays/objects out of
 *   the render path).
 * @param enabled When false, no auto-fetch; `refetch()` is still callable.
 */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  initial: T,
  enabled = true,
): UseAsyncResourceResult<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial is treated as stable per call site
  const refetch = useCallback(async (): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      return result;
    } catch (err) {
      setError(extractApiError(err));
      setData(initial);
      return initial;
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (enabled) void refetch();
  }, [enabled, refetch]);

  return { data, loading, error, refetch };
}
