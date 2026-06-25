import api from "../api/api";
import { authStorage } from "./authStorage";
import { decodeJwt } from "../utils/jwt";
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  UserRole,
} from "../types";

function extractToken(
  response: LoginResponse
): string {
  const token =
    response.token ??
    response.accessToken ??
    response.jwt;

  if (!token) {
    throw new Error(
      "A API não retornou um token de autenticação."
    );
  }

  return token;
}

function normalizeRole(
  role?: string
): UserRole | undefined {
  if (role === "EMPLOYEE" || role === "MANAGER") {
    return role;
  }

  return undefined;
}

export async function login(
  credentials: LoginRequest
): Promise<AuthUser> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  const data = response.data;
  const token = extractToken(data);
  const payload = decodeJwt(token);

  const role =
    normalizeRole(data.role) ??
    normalizeRole(payload?.role);

  if (!role) {
    throw new Error(
      "Não foi possível identificar o perfil do usuário."
    );
  }

  const user: AuthUser = {
    id: data.id ?? payload?.id,
    nome:
      data.nome ??
      payload?.nome ??
      payload?.name,
    email:
      data.email ??
      payload?.email ??
      payload?.sub ??
      credentials.email,
    role,
    managerCode:
      data.managerCode ??
      payload?.managerCode,
  };

  authStorage.setToken(token);
  authStorage.setUser(user);

  return user;
}

export function logout(): void {
  authStorage.clear();
}