import { apiRequest } from "@/lib/api/client";
import { storeSession } from "@/lib/auth/sessionStore";
import { ApiSuccessResponse } from "@/types/api";
import { AuthResponse, AuthSession, AuthUser, LoginRequest, RegisterRequest } from "@/types/auth";

type RegisterResponseData = {
  userId: string;
  role: RegisterRequest["role"];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function loginUser(request: LoginRequest): Promise<AuthSession> {
  const response = await apiRequest<ApiSuccessResponse<AuthResponse>>("/auth/login", {
    method: "POST",
    auth: "none",
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
    auth: "none",
    retryOnAuthFailure: false,
    body: JSON.stringify({ refreshToken }),
  });

  storeSession(response.data);
  return response.data;
}

export async function registerUser(request: RegisterRequest): Promise<AuthSession> {
  await apiRequest<ApiSuccessResponse<RegisterResponseData>>("/auth/register", {
    method: "POST",
    auth: "none",
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
    auth: "required",
    cache: "no-store",
  });

  return response.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await apiRequest<ApiSuccessResponse<null>>("/auth/logout", {
    method: "POST",
    auth: "none",
    retryOnAuthFailure: false,
    body: JSON.stringify({ refreshToken }),
  });
}
