import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Clipboard,
  Clock3,
  Copy,
  LogOut,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { getTeamVacations } from "../services/managerService";

import type { Vacation } from "../types";

import {
  formatDate,
  getVacationStatus,
  getVacationStatusLabel,
  type VacationStatus,
} from "../utils/date";

type StatusFilter =
  | "ALL"
  | VacationStatus;

export function ManagerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [vacations, setVacations] = useState<
    Vacation[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [copied, setCopied] =
    useState(false);

  async function loadVacations() {
    setLoading(true);
    setError("");

    try {
      const response =
        await getTeamVacations();

      setVacations(
        [...response].sort((first, second) =>
          first.startDate.localeCompare(
            second.startDate
          )
        )
      );
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ??
          "Não foi possível carregar as férias da equipe."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVacations();
  }, []);

  const employeesCount = useMemo(() => {
    const employeeIds = vacations
      .map((vacation) => vacation.employeeId)
      .filter(
        (employeeId): employeeId is number =>
          employeeId !== undefined
      );

    return new Set(employeeIds).size;
  }, [vacations]);

  const totalDays = useMemo(() => {
    return vacations.reduce(
      (total, vacation) =>
        total + vacation.totalDays,
      0
    );
  }, [vacations]);

  const nextVacation = useMemo(() => {
    return vacations.find(
      (vacation) =>
        getVacationStatus(
          vacation.startDate,
          vacation.endDate
        ) === "SCHEDULED"
    );
  }, [vacations]);

  const filteredVacations = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return vacations.filter((vacation) => {
      const employeeName =
        vacation.employeeName?.toLowerCase() ??
        "";

      const matchesSearch =
        normalizedSearch.length === 0 ||
        employeeName.includes(
          normalizedSearch
        );

      const status = getVacationStatus(
        vacation.startDate,
        vacation.endDate
      );

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    vacations,
    search,
    statusFilter,
  ]);

  async function copyManagerCode() {
    if (!user?.managerCode) {
      return;
    }

    await navigator.clipboard.writeText(
      user.managerCode
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
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
            Área do gerente
          </span>

          <h1>
            Olá, {user?.nome ?? "gerente"}!
          </h1>

          <p>
            Acompanhe os períodos de férias da sua
            equipe.
          </p>
        </div>

        <button
          className="secondary-dashboard-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sair
        </button>
      </header>

      <main className="dashboard-content">
        <section className="stats-grid manager-stats-grid">
          <article className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>

            <div>
              <span>Funcionários</span>
              <strong>{employeesCount}</strong>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">
              <CalendarDays size={24} />
            </div>

            <div>
              <span>Períodos cadastrados</span>
              <strong>{vacations.length}</strong>
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
              <Clipboard size={24} />
            </div>

            <div>
              <span>Total de dias</span>
              <strong>{totalDays}</strong>
            </div>
          </article>
        </section>

        <section className="manager-dashboard-grid">
          <article className="dashboard-panel manager-code-panel">
            <div className="panel-heading">
              <div>
                <span>Equipe</span>
                <h2>Código do gerente</h2>
              </div>
            </div>

            <p className="manager-code-description">
              Compartilhe este código com os
              funcionários que devem ser vinculados
              à sua equipe.
            </p>

            <div className="manager-dashboard-code">
              <span>
                {user?.managerCode ??
                  "Código indisponível"}
              </span>

              <button
                type="button"
                onClick={copyManagerCode}
                disabled={!user?.managerCode}
              >
                <Copy size={18} />

                {copied
                  ? "Copiado!"
                  : "Copiar"}
              </button>
            </div>
          </article>

          <article className="dashboard-panel manager-vacations-panel">
            <div className="panel-heading">
              <div>
                <span>Planejamento</span>
                <h2>Férias da equipe</h2>
              </div>

              <button
                className="icon-dashboard-button"
                onClick={() =>
                  void loadVacations()
                }
                disabled={loading}
                aria-label="Atualizar férias da equipe"
              >
                <RefreshCw
                  size={19}
                  className={
                    loading ? "spinning" : ""
                  }
                />
              </button>
            </div>

            <div className="manager-filters">
              <div className="search-field">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Buscar funcionário..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter
                  )
                }
              >
                <option value="ALL">
                  Todos os status
                </option>

                <option value="SCHEDULED">
                  Agendadas
                </option>

                <option value="IN_PROGRESS">
                  Em andamento
                </option>

                <option value="COMPLETED">
                  Concluídas
                </option>
              </select>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {loading ? (
              <div className="vacation-loading">
                <div className="spinner" />

                <p>
                  Carregando férias da equipe...
                </p>
              </div>
            ) : vacations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Users size={32} />
                </div>

                <h3>
                  Nenhuma férias cadastrada
                </h3>

                <p>
                  Os períodos cadastrados pelos
                  funcionários aparecerão aqui.
                </p>
              </div>
            ) : filteredVacations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Search size={32} />
                </div>

                <h3>
                  Nenhum resultado encontrado
                </h3>

                <p>
                  Altere a busca ou o filtro
                  selecionado.
                </p>
              </div>
            ) : (
              <>
                <div className="manager-results-count">
                  {filteredVacations.length}{" "}
                  {filteredVacations.length === 1
                    ? "resultado"
                    : "resultados"}
                </div>

                <div className="team-vacation-list">
                  {filteredVacations.map(
                    (vacation) => {
                      const status =
                        getVacationStatus(
                          vacation.startDate,
                          vacation.endDate
                        );

                      return (
                        <article
                          key={vacation.id}
                          className="team-vacation-card"
                        >
                          <div className="employee-avatar">
                            {vacation.employeeName
                              ?.charAt(0)
                              .toUpperCase() ??
                              "F"}
                          </div>

                          <div className="team-vacation-info">
                            <strong>
                              {vacation.employeeName ??
                                "Funcionário"}
                            </strong>

                            <span>
                              {formatDate(
                                vacation.startDate
                              )}
                              {" até "}
                              {formatDate(
                                vacation.endDate
                              )}
                            </span>
                          </div>

                          <div className="team-vacation-meta">
                            <span>
                              {vacation.totalDays}{" "}
                              {vacation.totalDays === 1
                                ? "dia"
                                : "dias"}
                            </span>

                            <span
                              className={`vacation-status ${status.toLowerCase()}`}
                            >
                              {getVacationStatusLabel(
                                status
                              )}
                            </span>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

