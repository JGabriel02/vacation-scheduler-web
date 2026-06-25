import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";

import { authStorage } from "../services/authStorage";
import { decodeJwt, isTokenExpired } from "../utils/jwt";

import type {
  AuthUser,
  LoginRequest,
} from "../types";

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login(
    credentials: LoginRequest
  ): Promise<AuthUser>;

  logout(): void;
}

const AuthContext =
  createContext<AuthContextData | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (!storedToken || !storedUser) {
      authStorage.clear();
      setIsLoading(false);
      return;
    }

    const payload = decodeJwt(storedToken);

    if (isTokenExpired(payload)) {
      authStorage.clear();
      setIsLoading(false);
      return;
    }

    setUser(storedUser);
    setIsLoading(false);
  }, []);

  async function login(
    credentials: LoginRequest
  ): Promise<AuthUser> {
    const authenticatedUser =
      await loginRequest(credentials);

    setUser(authenticatedUser);

    return authenticatedUser;
  }

  function logout(): void {
    logoutRequest();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth precisa ser usado dentro de AuthProvider."
    );
  }

  return context;
}