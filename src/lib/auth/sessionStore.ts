import { AuthSession } from "@/types/auth";

const SESSION_KEY = "rentalapp.auth.session";

type SessionListener = (session: AuthSession | null) => void;

const listeners = new Set<SessionListener>();

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

function notifyListeners(session: AuthSession | null) {
  listeners.forEach((listener) => listener(session));
}

export function getStoredSession(): AuthSession | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: AuthSession) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifyListeners(session);
}

export function clearStoredSession() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  notifyListeners(null);
}

export function subscribeToSession(listener: SessionListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
