import { AuthResult, AuthSession, AuthUser, LoginRequest, RegisterRequest } from "@/types/auth";

type StoredMockUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: RegisterRequest["role"];
};

const USERS_KEY = "rentalapp.mock.users";
const SESSION_KEY = "rentalapp.mock.session";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureBrowser() {
  if (typeof window === "undefined") {
    throw new Error("Mock auth service is only available in the browser.");
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readUsers(): StoredMockUser[] {
  ensureBrowser();
  const raw = window.localStorage.getItem(USERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredMockUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredMockUser[]) {
  ensureBrowser();
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toSession(user: StoredMockUser): AuthSession {
  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };

  return {
    accessToken: `mock-access-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    user: authUser,
  };
}

function writeSession(session: AuthSession | null) {
  ensureBrowser();

  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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

export async function registerMockUser(request: RegisterRequest): Promise<AuthResult> {
  await wait(500);

  const users = readUsers();
  const normalizedEmail = normalizeEmail(request.email);
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const createdUser: StoredMockUser = {
    id: crypto.randomUUID(),
    fullName: request.fullName.trim(),
    email: normalizedEmail,
    password: request.password,
    role: request.role,
  };

  users.push(createdUser);
  writeUsers(users);

  const session = toSession(createdUser);
  writeSession(session);

  return {
    message: "Account created successfully.",
    session,
  };
}

export async function loginMockUser(request: LoginRequest): Promise<AuthResult> {
  await wait(400);

  const users = readUsers();
  const normalizedEmail = normalizeEmail(request.email);
  const matchedUser = users.find((user) => user.email === normalizedEmail);

  if (!matchedUser || matchedUser.password !== request.password) {
    throw new Error("Invalid email or password.");
  }

  const session = toSession(matchedUser);
  writeSession(session);

  return {
    message: "Login successful.",
    session,
  };
}

export async function logoutMockUser(): Promise<void> {
  await wait(150);
  writeSession(null);
}
