import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
} from "lucide-react";

import { toast } from "sonner";

import { registerEmployee } from "../services/employeeService";
import { getApiErrorMessage } from "../utils/apiError";

export function EmployeeRegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    admissionDate: "",
    managerCode: "",
  });

  const [loading, setLoading] =
    useState(false);

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    try {
      await registerEmployee({
        ...form,
        nome: form.nome.trim(),
        email: form.email.trim(),
        managerCode: form.managerCode
          .trim()
          .toUpperCase(),
      });

      toast.success(
        "Conta criada com sucesso. Faça seu login."
      );

      navigate("/login", {
        state: {
          email: form.email.trim(),
        },
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
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

          <h1>Criar conta de funcionário</h1>

          <p>
            Informe seus dados e o código fornecido
            pelo gerente.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">
              Nome completo
            </label>

            <input
              id="nome"
              value={form.nome}
              onChange={(event) =>
                updateField(
                  "nome",
                  event.target.value
                )
              }
              autoComplete="name"
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Senha
            </label>

            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) =>
                updateField(
                  "password",
                  event.target.value
                )
              }
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admissionDate">
              Data de admissão
            </label>

            <input
              id="admissionDate"
              type="date"
              value={form.admissionDate}
              onChange={(event) =>
                updateField(
                  "admissionDate",
                  event.target.value
                )
              }
              max={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="managerCode">
              Código do gerente
            </label>

            <input
              id="managerCode"
              value={form.managerCode}
              onChange={(event) =>
                updateField(
                  "managerCode",
                  event.target.value.toUpperCase()
                )
              }
              placeholder="Ex.: SMAUZXV2"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button full-button"
            disabled={loading}
          >
            {loading
              ? "Criando conta..."
              : "Criar conta de funcionário"}
          </button>
        </form>

        <p className="auth-footer-text">
          Já possui uma conta?{" "}
          <Link to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}