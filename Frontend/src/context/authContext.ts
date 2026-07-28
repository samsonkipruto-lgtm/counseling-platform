import { createContext } from "react";

export type Role = "student" | "counselor" | "admin";

export interface AuthContextType {
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, otp: string) => Promise<Role>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
