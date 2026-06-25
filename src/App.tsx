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
import { NotFoundPage } from "./pages/NotFoundPage";

import { EmployeeRoute } from "./components/EmployeeRoute";
import { ManagerRoute } from "./components/ManagerRoute";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <HomePage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register/manager"
          element={
            <PublicOnlyRoute>
              <ManagerRegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register/employee"
          element={
            <PublicOnlyRoute>
              <EmployeeRegisterPage />
            </PublicOnlyRoute>
          }
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
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;