import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

interface ManagerRouteProps {
  children: ReactNode;
}

export function ManagerRoute({
  children,
}: ManagerRouteProps) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === "MANAGER" ? (
        children
      ) : (
        <Navigate
          to="/dashboard"
          replace
        />
      )}
    </ProtectedRoute>
  );
}