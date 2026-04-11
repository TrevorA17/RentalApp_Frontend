import { Role } from "@/types/domain";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  role: Exclude<Role, "ADMIN">;
};

export type AuthResult = {
  message: string;
  session: AuthSession;
};
