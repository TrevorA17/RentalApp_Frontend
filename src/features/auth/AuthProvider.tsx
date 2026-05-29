"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from "@/lib/auth/authService";
import { getSessionSnapshot, useAuthStore } from "@/stores/auth-store";
import type { AuthSession, LoginRequest, RegisterRequest } from "@/types/auth";

type AuthContextValue = {
  session: AuthSession | null;
  isLoading: boolean;
  isSubmitting: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const storeUser = useAuthStore((state) => state.user);
  const storeAccessToken = useAuthStore((state) => state.accessToken);
  const storeRefreshToken = useAuthStore((state) => state.refreshToken);
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const session: AuthSession | null =
    storeIsAuthenticated && storeUser && storeAccessToken && storeRefreshToken
      ? {
          user: storeUser,
          accessToken: storeAccessToken,
          refreshToken: storeRefreshToken,
        }
      : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const stored = getSessionSnapshot();

        if (!stored) {
          return;
        }

        try {
          const user = await getCurrentUser(stored.accessToken);
          useAuthStore.getState().updateUser(user);
        } catch {
          await refreshSession(stored.refreshToken);
        }
      } catch {
        useAuthStore.getState().logout();
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  async function login(request: LoginRequest) {
    setIsSubmitting(true);
    try {
      await loginUser(request);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(request: RegisterRequest) {
    setIsSubmitting(true);
    try {
      await registerUser(request);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    try {
      if (session?.refreshToken) {
        await logoutUser(session.refreshToken);
      }
    } finally {
      useAuthStore.getState().logout();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isSubmitting,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
