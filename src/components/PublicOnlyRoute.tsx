import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({
  children,
}: PublicOnlyRouteProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return children;
  }

  if (user?.role === "MANAGER") {
    return (
      <Navigate
        to="/manager"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}