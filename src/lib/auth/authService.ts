import { apiRequest } from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types/api";
import { AuthResponse, AuthSession, AuthUser, LoginRequest, RegisterRequest } from "@/types/auth";

const SESSION_KEY = "rentalapp.auth.session";

type RegisterResponseData = {
  userId: string;
  role: RegisterRequest["role"];
};

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Auth storage is only available in the browser.");
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getStoredSession(): AuthSession | null {
  ensureBrowser();
  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearStoredSession() {
  ensureBrowser();
  window.localStorage.removeItem(SESSION_KEY);
}

function storeSession(session: AuthSession) {
  ensureBrowser();
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function loginUser(request: LoginRequest): Promise<AuthSession> {
  const response = await apiRequest<ApiSuccessResponse<AuthResponse>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: normalizeEmail(request.email),
      password: request.password,
    }),
  });

  storeSession(response.data);
  return response.data;
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const response = await apiRequest<ApiSuccessResponse<AuthResponse>>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  storeSession(response.data);
  return response.data;
}

export async function registerUser(request: RegisterRequest): Promise<AuthSession> {
  await apiRequest<ApiSuccessResponse<RegisterResponseData>>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName: request.fullName.trim(),
      email: normalizeEmail(request.email),
      password: request.password,
      role: request.role,
    }),
  });

  return loginUser({
    email: request.email,
    password: request.password,
  });
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await apiRequest<ApiSuccessResponse<AuthUser>>("/auth/me", {
    method: "GET",
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await apiRequest<ApiSuccessResponse<null>>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
