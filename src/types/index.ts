export type UserRole = "EMPLOYEE" | "MANAGER";

export interface AuthUser {
  id?: number;
  nome?: string;
  email: string;
  role?: UserRole;
  managerCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  id?: number;
  nome?: string;
  email?: string;
  role?: UserRole;
  managerCode?: string;
}

export interface ManagerRegisterRequest {
  nome: string;
  email: string;
  password: string;
  admissionDate: string;
}

export interface ManagerResponse {
  id: number;
  nome: string;
  email: string;
  role: "MANAGER";
  managerCode: string;
}

export interface EmployeeRegisterRequest {
  nome: string;
  email: string;
  password: string;
  admissionDate: string;
  managerCode: string;
}

export interface VacationRequest {
  startDate: string;
  endDate: string;
}

export interface Vacation {
  id: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  employeeId?: number;
  employeeName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;

  id?: number;
  nome?: string;
  email?: string;
  role?: UserRole;
  managerCode?: string;
}

export interface JwtPayload {
  sub?: string;
  email?: string;
  nome?: string;
  name?: string;
  role?: UserRole;
  id?: number;
  managerCode?: string;
  exp?: number;
}

