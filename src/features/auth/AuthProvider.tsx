"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getStoredSession,
  loginMockUser,
  logoutMockUser,
  registerMockUser,
} from "@/lib/auth/mockAuthService";
import { AuthSession, LoginRequest, RegisterRequest } from "@/types/auth";

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
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      setSession(getStoredSession());
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function login(request: LoginRequest) {
    setIsSubmitting(true);

    try {
      const result = await loginMockUser(request);
      setSession(result.session);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(request: RegisterRequest) {
    setIsSubmitting(true);

    try {
      const result = await registerMockUser(request);
      setSession(result.session);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setIsSubmitting(true);

    try {
      await logoutMockUser();
      setSession(null);
    } finally {
      setIsSubmitting(false);
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
