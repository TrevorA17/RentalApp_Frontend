import { apiConfig } from "@/lib/api/config";
import { ApiErrorResponse } from "@/types/api";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse & { code?: string };
      if (errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // Ignore JSON parse failure and keep default message.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
