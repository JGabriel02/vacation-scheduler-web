import {
  ArrowLeft,
  CalendarX2,
  Home,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export function NotFoundPage() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  function getMainRoute(): string {
    if (!isAuthenticated) {
      return "/";
    }

    return user?.role === "MANAGER"
      ? "/manager"
      : "/dashboard";
  }

  function getButtonLabel(): string {
    return isAuthenticated
      ? "Voltar para o dashboard"
      : "Voltar para o início";
  }

  return (
    <main className="not-found-modern-page">
      <section className="not-found-modern-card">
        <div className="not-found-illustration">
          <CalendarX2 size={54} />
        </div>

        <span className="not-found-code">
          404
        </span>

        <h1>Página não encontrada</h1>

        <p>
          A página que você tentou acessar não
          existe, foi removida ou teve seu endereço
          alterado.
        </p>

        <div className="not-found-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <Link
            to={getMainRoute()}
            className="primary-button"
          >
            <Home size={18} />
            {getButtonLabel()}
          </Link>
        </div>
      </section>
    </main>
  );
}