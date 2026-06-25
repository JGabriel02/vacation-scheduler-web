import api from "../api/api";
import type {
  EmployeeRegisterRequest,
} from "../types";

export async function registerEmployee(
  data: EmployeeRegisterRequest
) {
  const response = await api.post(
    "/employees",
    data
  );

  return response.data;
}