import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  CalendarDays,
  Clock3,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  Umbrella,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../contexts/AuthContext";

import {
  createVacation,
  deleteVacation,
  getVacations,
} from "../services/vacationService";

import { ConfirmDialog } from "../components/ConfirmDialog";

import type {
  Vacation,
  VacationRequest,
} from "../types";

import {
  calculateDays,
  formatDate,
  getVacationStatus,
  getVacationStatusLabel,
} from "../utils/date";

import { getApiErrorMessage } from "../utils/apiError";

export function EmployeeDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [vacations, setVacations] = useState<
    Vacation[]
  >([]);

  const [form, setForm] =
    useState<VacationRequest>({
      startDate: "",
      endDate: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [
    vacationToDelete,
    setVacationToDelete,
  ] = useState<Vacation | null>(null);

  async function loadVacations() {
    setLoading(true);

    try {
      const response = await getVacations();

      setVacations(
        [...response].sort((first, second) =>
          first.startDate.localeCompare(
            second.startDate
          )
        )
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVacations();
  }, []);

  const nextVacation = useMemo(() => {
    return vacations.find(
      (vacation) =>
        getVacationStatus(
          vacation.startDate,
          vacation.endDate
        ) === "SCHEDULED"
    );
  }, [vacations]);

  const totalDays = useMemo(() => {
    return vacations.reduce(
      (total, vacation) =>
        total + vacation.totalDays,
      0
    );
  }, [vacations]);

  const calculatedDays = useMemo(() => {
    if (
      !form.startDate ||
      !form.endDate
    ) {
      return 0;
    }

    if (
      form.endDate < form.startDate
    ) {
      return 0;
    }

    return calculateDays(
      form.startDate,
      form.endDate
    );
  }, [form]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      form.endDate < form.startDate
    ) {
      toast.error(
        "A data final não pode ser anterior à data inicial."
      );

      return;
    }

    setSubmitting(true);

    try {
      const createdVacation =
        await createVacation(form);

      setVacations((current) =>
        [
          ...current,
          createdVacation,
        ].sort((first, second) =>
          first.startDate.localeCompare(
            second.startDate
          )
        )
      );

      setForm({
        startDate: "",
        endDate: "",
      });

      toast.success(
        "Período de férias cadastrado com sucesso."
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!vacationToDelete) {
      return;
    }

    const vacationId =
      vacationToDelete.id;

    setDeletingId(vacationId);

    try {
      await deleteVacation(vacationId);

      setVacations((current) =>
        current.filter(
          (vacation) =>
            vacation.id !== vacationId
        )
      );

      setVacationToDelete(null);

      toast.success(
        "Período de férias excluído com sucesso."
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            Área do funcionário
          </span>

          <h1>
            Olá, {user?.nome ?? "funcionário"}!
          </h1>

          <p>
            Organize seus períodos de descanso e
            acompanhe suas férias.
          </p>
        </div>

        <button
          type="button"
          className="secondary-dashboard-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sair
        </button>
      </header>

      <main className="dashboard-content">
        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon">
              <CalendarDays size={24} />
            </div>

            <div>
              <span>
                Períodos cadastrados
              </span>

              <strong>
                {vacations.length}
              </strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">
              <Clock3 size={24} />
            </div>

            <div>
              <span>Próximas férias</span>

              <strong className="stat-date">
                {nextVacation
                  ? formatDate(
                      nextVacation.startDate
                    )
                  : "Nenhuma"}
              </strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">
              <Umbrella size={24} />
            </div>

            <div>
              <span>Total de dias</span>
              <strong>{totalDays}</strong>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Novo período</span>
                <h2>Solicitar férias</h2>
              </div>

              <div className="panel-heading-icon">
                <Plus size={22} />
              </div>
            </div>

            <form
              className="vacation-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="startDate">
                  Data inicial
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      startDate:
                        event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">
                  Data final
                </label>

                <input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      endDate:
                        event.target.value,
                    }))
                  }
                  required
                />
              </div>

              {calculatedDays > 0 && (
                <div className="days-preview">
                  <CalendarDays size={18} />

                  <span>
                    Total previsto:
                    <strong>
                      {" "}
                      {calculatedDays}{" "}
                      {calculatedDays === 1
                        ? "dia"
                        : "dias"}
                    </strong>
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="primary-button full-button"
                disabled={submitting}
              >
                {submitting
                  ? "Cadastrando..."
                  : "Cadastrar férias"}
              </button>
            </form>
          </article>

          <article className="dashboard-panel vacations-panel">
            <div className="panel-heading">
              <div>
                <span>Histórico</span>
                <h2>Minhas férias</h2>
              </div>

              <button
                type="button"
                className="icon-dashboard-button"
                onClick={() =>
                  void loadVacations()
                }
                aria-label="Atualizar férias"
                disabled={loading}
              >
                <RefreshCw
                  size={19}
                  className={
                    loading
                      ? "spinning"
                      : ""
                  }
                />
              </button>
            </div>

            {loading ? (
              <div className="vacation-loading">
                <div className="spinner" />

                <p>
                  Carregando suas férias...
                </p>
              </div>
            ) : vacations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <CalendarDays size={32} />
                </div>

                <h3>
                  Nenhuma férias cadastrada
                </h3>

                <p>
                  Utilize o formulário ao lado
                  para cadastrar seu primeiro
                  período.
                </p>
              </div>
            ) : (
              <div className="vacation-list">
                {vacations.map(
                  (vacation) => {
                    const status =
                      getVacationStatus(
                        vacation.startDate,
                        vacation.endDate
                      );

                    return (
                      <article
                        key={vacation.id}
                        className="vacation-card"
                      >
                        <div className="vacation-card-main">
                          <div className="vacation-card-icon">
                            <CalendarDays
                              size={22}
                            />
                          </div>

                          <div>
                            <strong>
                              {formatDate(
                                vacation.startDate
                              )}
                              {" até "}
                              {formatDate(
                                vacation.endDate
                              )}
                            </strong>

                            <span>
                              {vacation.totalDays}{" "}
                              {vacation.totalDays === 1
                                ? "dia"
                                : "dias"}
                            </span>
                          </div>
                        </div>

                        <div className="vacation-card-actions">
                          <span
                            className={`vacation-status ${status.toLowerCase()}`}
                          >
                            {getVacationStatusLabel(
                              status
                            )}
                          </span>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              setVacationToDelete(
                                vacation
                              )
                            }
                            disabled={
                              deletingId ===
                              vacation.id
                            }
                            aria-label="Excluir férias"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </article>
        </section>
      </main>

      <ConfirmDialog
        isOpen={
          vacationToDelete !== null
        }
        title="Excluir período de férias?"
        description={
          vacationToDelete
            ? `O período de ${formatDate(
                vacationToDelete.startDate
              )} até ${formatDate(
                vacationToDelete.endDate
              )} será excluído. Esta ação não poderá ser desfeita.`
            : ""
        }
        confirmText="Excluir férias"
        destructive
        loading={deletingId !== null}
        onConfirm={() =>
          void handleDelete()
        }
        onCancel={() => {
          if (deletingId === null) {
            setVacationToDelete(null);
          }
        }}
      />
    </div>
  );
}