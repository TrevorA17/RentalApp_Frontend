import client from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  AuthResponse,
  AuthSession,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

type RegisterResponseData = {
  userId: string;
  role: RegisterRequest["role"];
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function loginUser(request: LoginRequest): Promise<AuthSession> {
  const res = await client.post<ApiSuccessResponse<AuthResponse>>(
    "/auth/login",
    {
      email: normalizeEmail(request.email),
      password: request.password,
    },
    { meta: { auth: "none" } },
  );
  useAuthStore.getState().setSession(res.data.data);
  return res.data.data;
}

export async function refreshSession(
  refreshToken: string,
): Promise<AuthSession> {
  const res = await client.post<ApiSuccessResponse<AuthResponse>>(
    "/auth/refresh",
    { refreshToken },
    { meta: { auth: "none", skipRefresh: true } },
  );
  useAuthStore.getState().setSession(res.data.data);
  return res.data.data;
}

export async function registerUser(
  request: RegisterRequest,
): Promise<AuthSession> {
  await client.post<ApiSuccessResponse<RegisterResponseData>>(
    "/auth/register",
    {
      fullName: request.fullName.trim(),
      email: normalizeEmail(request.email),
      password: request.password,
      role: request.role,
    },
    { meta: { auth: "none" } },
  );

  return loginUser({
    email: request.email,
    password: request.password,
  });
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const res = await client.get<ApiSuccessResponse<AuthUser>>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    meta: { auth: "required" },
  });
  return res.data.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await client.post<ApiSuccessResponse<null>>(
    "/auth/logout",
    { refreshToken },
    { meta: { auth: "none", skipRefresh: true } },
  );
}
