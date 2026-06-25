import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ManagerRegisterPage } from "./pages/ManagerRegisterPage";
import { EmployeeRegisterPage } from "./pages/EmployeeRegisterPage";
import { EmployeeDashboardPage } from "./pages/EmployeeDashboardPage";
import { ManagerDashboardPage } from "./pages/ManagerDashboardPage";

import { EmployeeRoute } from "./components/EmployeeRoute";
import { ManagerRoute } from "./components/ManagerRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register/manager"
          element={<ManagerRegisterPage />}
        />

        <Route
          path="/register/employee"
          element={<EmployeeRegisterPage />}
        />

        <Route
          path="/dashboard"
          element={
            <EmployeeRoute>
              <EmployeeDashboardPage />
            </EmployeeRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ManagerRoute>
              <ManagerDashboardPage />
            </ManagerRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="not-found-page">
              <h1>404</h1>
              <p>Página não encontrada.</p>

              <a
                href="/"
                className="primary-button"
              >
                Voltar para o início
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;