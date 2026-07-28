import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Role = "student" | "counselor" | "admin";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
