import api from "../api/api";

import type {
  Vacation,
  VacationRequest,
} from "../types";

export async function createVacation(
  data: VacationRequest
): Promise<Vacation> {
  const response = await api.post<Vacation>(
    "/vacations",
    data
  );

  return response.data;
}

export async function getVacations(): Promise<Vacation[]> {
  const response = await api.get<Vacation[]>(
    "/vacations/me"
  );

  return response.data;
}

export async function deleteVacation(
  id: number
): Promise<void> {
  await api.delete(`/vacations/${id}`);
}