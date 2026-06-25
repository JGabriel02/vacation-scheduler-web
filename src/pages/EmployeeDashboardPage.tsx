import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function EmployeeDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="temporary-dashboard">
      <h1>
        Olá, {user?.nome ?? "funcionário"}!
      </h1>

      <p>
        Seu dashboard de férias será desenvolvido
        na próxima etapa.
      </p>

      <button
        className="primary-button"
        onClick={handleLogout}
      >
        Sair
      </button>
    </div>
  );
}