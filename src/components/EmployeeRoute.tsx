import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

interface EmployeeRouteProps {
  children: ReactNode;
}

export function EmployeeRoute({
  children,
}: EmployeeRouteProps) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === "EMPLOYEE" ? (
        children
      ) : (
        <Navigate
          to="/manager"
          replace
        />
      )}
    </ProtectedRoute>
  );
}