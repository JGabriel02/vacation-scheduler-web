import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ManagerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="temporary-dashboard">
      <h1>
        Olá, {user?.nome ?? "gerente"}!
      </h1>

      <p>
        Aqui você acompanhará as férias da sua
        equipe.
      </p>

      {user?.managerCode && (
        <div className="manager-code-box">
          <span>Código do gerente</span>
          <strong>{user.managerCode}</strong>
        </div>
      )}

      <button
        className="primary-button"
        onClick={handleLogout}
      >
        Sair
      </button>
    </div>
  );
}