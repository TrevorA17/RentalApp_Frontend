"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearStoredSession,
  getCurrentUser,
  getStoredSession,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from "@/lib/auth/authService";
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
    async function restoreSession() {
      try {
        const storedSession = getStoredSession();

        if (!storedSession) {
          setSession(null);
          return;
        }

        try {
          const user = await getCurrentUser(storedSession.accessToken);
          setSession({
            ...storedSession,
            user,
          });
        } catch {
          const refreshedSession = await refreshSession(storedSession.refreshToken);
          const user = await getCurrentUser(refreshedSession.accessToken);
          setSession({
            ...refreshedSession,
            user,
          });
        }
      } catch {
        clearStoredSession();
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  async function login(request: LoginRequest) {
    setIsSubmitting(true);

    try {
      const session = await loginUser(request);
      setSession(session);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(request: RegisterRequest) {
    setIsSubmitting(true);

    try {
      const session = await registerUser(request);
      setSession(session);
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
      clearStoredSession();
      setSession(null);
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
