import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { apiConfig } from "@/lib/api/config";
import { useAuthStore } from "@/stores/auth-store";
import type {
  ApiErrorItem,
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/types/api";
import type { AuthResponse } from "@/types/auth";

type AuthMode = "none" | "optional" | "required";

type RequestMeta = {
  auth?: AuthMode;
  skipRefresh?: boolean;
  hasRetried?: boolean;
};

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    meta?: RequestMeta;
  }
  export interface AxiosRequestConfig {
    meta?: RequestMeta;
  }
}

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: ApiErrorItem[];

  constructor(
    status: number,
    message: string,
    options: { code?: string; errors?: ApiErrorItem[] } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = options.code;
    this.errors = options.errors;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

function generateRequestId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const client = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

// Retry network errors and idempotent 5xx only. Mutations are not retried by default.
axiosRetry(client, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: axiosRetry.isNetworkOrIdempotentRequestError,
});

// Request interceptor: attach access token + correlation id.
client.interceptors.request.use((config) => {
  const meta = config.meta ?? {};
  const auth: AuthMode = meta.auth ?? "optional";

  if (auth !== "none") {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else if (auth === "required") {
      useAuthStore.getState().logout();
      const synthetic = new axios.AxiosError(
        "Your session has expired. Please sign in again.",
        "AUTH_REQUIRED",
        config,
      );
      synthetic.response = {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: {
          success: false,
          message: "Your session has expired. Please sign in again.",
          code: "AUTH_REQUIRED",
        } satisfies ApiErrorResponse,
      };
      throw synthetic;
    }
  }

  if (!config.headers.has("X-Request-Id")) {
    config.headers.set("X-Request-Id", generateRequestId());
  }

  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  return config;
});

// Refresh-queue: serializes concurrent 401s so we only refresh once.
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  refreshQueue = [];
}

const SKIP_REFRESH_PATHS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/register",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";
    const meta = originalRequest.meta ?? {};
    const skipRefresh =
      meta.skipRefresh === true ||
      meta.auth === "none" ||
      SKIP_REFRESH_PATHS.some((path) => url.startsWith(path)) ||
      !isBrowser();

    if (skipRefresh || meta.hasRetried) {
      if (!skipRefresh) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.set("Authorization", `Bearer ${token}`);
        originalRequest.meta = { ...meta, hasRetried: true };
        return client(originalRequest);
      });
    }

    isRefreshing = true;
    const currentRefreshToken = useAuthStore.getState().refreshToken;

    if (!currentRefreshToken) {
      isRefreshing = false;
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    try {
      const res = await axios.post<ApiSuccessResponse<AuthResponse>>(
        `${apiConfig.baseUrl}/auth/refresh`,
        { refreshToken: currentRefreshToken },
        { headers: { "Content-Type": "application/json" } },
      );
      const refreshed = res.data.data;
      useAuthStore.getState().setSession(refreshed);
      processQueue(null, refreshed.accessToken);

      originalRequest.headers.set(
        "Authorization",
        `Bearer ${refreshed.accessToken}`,
      );
      originalRequest.meta = { ...meta, hasRetried: true };
      return client(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ---------------------------------------------------------------------------
// Error helpers (mirrors swirra-frontend).
// ---------------------------------------------------------------------------

export function extractApiError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.errors?.length) {
      return err.errors
        .map((item) =>
          item.field ? `${item.field}: ${item.message}` : item.message,
        )
        .join(", ");
    }
    return err.message;
  }
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorResponse | undefined;
    if (data?.errors?.length) {
      return data.errors
        .map((item) =>
          item.field ? `${item.field}: ${item.message}` : item.message,
        )
        .join(", ");
    }
    if (data?.message) return data.message;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function extractBlobApiError(err: unknown): Promise<string> {
  if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
    try {
      const text = await err.response.data.text();
      const parsed = JSON.parse(text);
      err.response.data = parsed;
    } catch {
      // Body wasn't JSON — fall through to plain extractApiError.
    }
  }
  return extractApiError(err);
}

export default client;
