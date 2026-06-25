import api from "../api/api";
import type {
  ManagerRegisterRequest,
  ManagerResponse,
  Vacation,
} from "../types";

export async function registerManager(
  data: ManagerRegisterRequest
): Promise<ManagerResponse> {
  const response = await api.post<ManagerResponse>(
    "/managers",
    data
  );

  return response.data;
}

export async function getTeamVacations(): Promise<
  Vacation[]
> {
  const response = await api.get<Vacation[]>(
    "/managers/vacations"
  );

  return response.data;
}