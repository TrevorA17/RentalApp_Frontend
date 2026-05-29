import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DELAY_MS = 400;

interface Options {
  initial?: string;
  delayMs?: number;
}

/**
 * Debounced search input. `search` updates immediately for controlled inputs;
 * `debouncedSearch` lags by `delayMs` for issuing the actual query.
 */
export function useDebouncedSearch(opts: Options = {}) {
  const { initial = "", delayMs = DEFAULT_DELAY_MS } = opts;

  const [search, setSearch] = useState(initial);
  const [debouncedSearch, setDebouncedSearch] = useState(initial);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setSearchDebounced = useCallback(
    (value: string) => {
      setSearch(value);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDebouncedSearch(value), delayMs);
    },
    [delayMs],
  );

  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    setSearch("");
    setDebouncedSearch("");
  }, []);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return { search, debouncedSearch, setSearch: setSearchDebounced, reset };
}
