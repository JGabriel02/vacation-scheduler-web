import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const state = location.state as
    | {
        message?: string;
        email?: string;
      }
    | null;

  const query = new URLSearchParams(
    location.search
  );

  const sessionExpired =
    query.get("sessionExpired") === "true";

  const [email, setEmail] = useState(
    state?.email ?? ""
  );

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (state?.email) {
      setEmail(state.email);
    }
  }, [state?.email]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await login({
        email,
        password,
      });

      if (user.role === "MANAGER") {
        navigate("/manager", {
          replace: true,
        });

        return;
      }

      navigate("/dashboard", {
        replace: true,
      });
    } catch (requestError: any) {
      if (!requestError.response) {
        setError(
          requestError.message ??
            "Não foi possível conectar à API."
        );

        return;
      }

      if (
        requestError.response.status === 401
      ) {
        setError("E-mail ou senha inválidos.");

        return;
      }

      setError(
        requestError.response?.data?.message ??
          "Não foi possível realizar o login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="auth-card">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <div className="auth-heading">
          <div className="brand-icon">
            <CalendarDays size={26} />
          </div>

          <h1>Entre na sua conta</h1>

          <p>
            Acesse sua conta para gerenciar suas
            férias.
          </p>
        </div>

        {state?.message && (
          <div className="success-message">
            {state.message}
          </div>
        )}

        {sessionExpired && (
          <div className="warning-message">
            Sua sessão expirou. Entre novamente.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="voce@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Senha
            </label>

            <div className="password-field">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Sua senha"
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button full-button"
            disabled={loading}
          >
            {loading
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>

        <div className="login-register-links">
          <p>Ainda não possui conta?</p>

          <Link to="/register/employee">
            Criar conta de funcionário
          </Link>

          <Link to="/register/manager">
            Criar conta de gerente
          </Link>
        </div>
      </div>
    </div>
  );
}