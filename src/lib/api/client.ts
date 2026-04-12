import { apiConfig } from "@/lib/api/config";
import { clearStoredSession, getStoredSession, storeSession } from "@/lib/auth/sessionStore";
import { ApiErrorItem, ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { AuthResponse, AuthSession } from "@/types/auth";

type AuthMode = "none" | "optional" | "required";

type RequestOptions = RequestInit & {
  auth?: AuthMode;
  retryOnAuthFailure?: boolean;
  token?: string | null;
  hasRetried?: boolean;
};

type ParsedError = {
  message: string;
  code?: string;
  errors?: ApiErrorItem[];
};

type InternalRequestOptions = RequestOptions;

let refreshPromise: Promise<AuthSession | null> | null = null;

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: ApiErrorItem[];

  constructor(status: number, message: string, options: { code?: string; errors?: ApiErrorItem[] } = {}) {
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

async function parseError(response: Response): Promise<ParsedError> {
  try {
    const errorBody = (await response.json()) as ApiErrorResponse;
    return {
      message: errorBody.message || `API request failed with status ${response.status}`,
      code: errorBody.code,
      errors: errorBody.errors,
    };
  } catch {
    return {
      message: `API request failed with status ${response.status}`,
    };
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

function buildHeaders(options: InternalRequestOptions, token?: string | null) {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

async function performRequest(path: string, options: InternalRequestOptions, token?: string | null): Promise<Response> {
  return fetch(`${apiConfig.baseUrl}${path}`, {
    ...options,
    headers: buildHeaders(options, token),
  });
}

async function refreshAccessToken(): Promise<AuthSession | null> {
  if (!isBrowser()) {
    return null;
  }

  const session = getStoredSession();

  if (!session?.refreshToken) {
    clearStoredSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${apiConfig.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });

      if (!response.ok) {
        clearStoredSession();
        return null;
      }

      const parsed = await parseJson<ApiSuccessResponse<AuthResponse>>(response);
      storeSession(parsed.data);
      return parsed.data;
    })()
      .catch(() => {
        clearStoredSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const requestOptions: InternalRequestOptions = options;
  const auth = requestOptions.auth ?? (requestOptions.token ? "optional" : "none");
  const retryOnAuthFailure = requestOptions.retryOnAuthFailure ?? auth !== "none";
  const session = auth === "none" ? null : getStoredSession();
  const token = requestOptions.token ?? session?.accessToken ?? null;

  if (auth === "required" && !token) {
    clearStoredSession();
    throw new ApiError(401, "Your session has expired. Please sign in again.", { code: "AUTH_REQUIRED" });
  }

  const response = await performRequest(path, requestOptions, token);

  if (response.ok) {
    return parseJson<T>(response);
  }

  if (
    response.status === 401 &&
    auth !== "none" &&
    retryOnAuthFailure &&
    !requestOptions.hasRetried &&
    isBrowser()
  ) {
    const refreshedSession = await refreshAccessToken();

    if (refreshedSession?.accessToken) {
      return apiRequest<T>(path, {
        ...options,
        token: refreshedSession.accessToken,
        hasRetried: true,
      });
    }
  }

  if (response.status === 401 && auth !== "none") {
    clearStoredSession();
  }

  const parsedError = await parseError(response);
  throw new ApiError(response.status, parsedError.message, {
    code: parsedError.code,
    errors: parsedError.errors,
  });
}
