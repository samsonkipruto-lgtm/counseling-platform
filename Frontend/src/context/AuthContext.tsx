import { useState, type ReactNode } from "react";
import { verifyOTP as verifyOTPRequest } from "../api/authAPI";
import {
  saveTokens,
  removeTokens,
  decodeRole,
  getToken,
} from "../utils/tokenUtils";
import { AuthContext, type Role } from "./authContext";

function getInitialAuthState(): {
  isAuthenticated: boolean;
  role: Role | null;
} {
  const token = getToken();
  if (!token) {
    return { isAuthenticated: false, role: null };
  }

  const decodedRole = decodeRole();
  if (!decodedRole) {
    return { isAuthenticated: false, role: null };
  }

  return { isAuthenticated: true, role: decodedRole };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => getInitialAuthState().isAuthenticated,
  );
  const [role, setRole] = useState<Role | null>(
    () => getInitialAuthState().role,
  );

  async function login(email: string, otp: string): Promise<Role> {
    const data = await verifyOTPRequest(email, otp);
    saveTokens(data.access, data.refresh);
    setIsAuthenticated(true);
    setRole(data.role);
    return data.role;
  }

  function logout(): void {
    removeTokens();
    setIsAuthenticated(false);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
