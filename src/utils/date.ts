export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

export function calculateDays(
  startDate: string,
  endDate: string
): number {
  const [startYear, startMonth, startDay] = startDate
    .split("-")
    .map(Number);

  const [endYear, endMonth, endDay] = endDate
    .split("-")
    .map(Number);

  const start = new Date(
    startYear,
    startMonth - 1,
    startDay
  );

  const end = new Date(
    endYear,
    endMonth - 1,
    endDay
  );

  const difference =
    end.getTime() - start.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  ) + 1;
}

export type VacationStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED";

export function getVacationStatus(
  startDate: string,
  endDate: string
): VacationStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startYear, startMonth, startDay] =
    startDate.split("-").map(Number);

  const [endYear, endMonth, endDay] =
    endDate.split("-").map(Number);

  const start = new Date(
    startYear,
    startMonth - 1,
    startDay
  );

  const end = new Date(
    endYear,
    endMonth - 1,
    endDay
  );

  if (today < start) {
    return "SCHEDULED";
  }

  if (today > end) {
    return "COMPLETED";
  }

  return "IN_PROGRESS";
}

export function getVacationStatusLabel(
  status: VacationStatus
): string {
  const labels: Record<VacationStatus, string> = {
    SCHEDULED: "Agendadas",
    IN_PROGRESS: "Em andamento",
    COMPLETED: "Concluídas",
  };

  return labels[status];
}

