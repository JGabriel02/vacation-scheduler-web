import {
  useState,
  type FormEvent,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
} from "lucide-react";

import { toast } from "sonner";

import { registerManager } from "../services/managerService";
import { getApiErrorMessage } from "../utils/apiError";

import type { ManagerResponse } from "../types";

export function ManagerRegisterPage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    admissionDate: "",
  });

  const [manager, setManager] =
    useState<ManagerResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [copied, setCopied] =
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
      const response = await registerManager({
        ...form,
        nome: form.nome.trim(),
        email: form.email.trim(),
      });

      setManager(response);

      toast.success(
        "Conta de gerente criada com sucesso."
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function copyManagerCode() {
    if (!manager) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        manager.managerCode
      );

      setCopied(true);

      toast.success("Código copiado.");

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error(
        "Não foi possível copiar o código."
      );
    }
  }

  if (manager) {
    return (
      <div className="form-page">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle2 size={38} />
          </div>

          <h1>Conta criada com sucesso!</h1>

          <p>
            Guarde o código abaixo e compartilhe
            somente com os funcionários da sua
            equipe.
          </p>

          <div className="manager-code-box">
            <span>Código do gerente</span>

            <strong>
              {manager.managerCode}
            </strong>

            <button
              type="button"
              onClick={copyManagerCode}
              className="copy-button"
            >
              <Copy size={18} />

              {copied
                ? "Copiado!"
                : "Copiar"}
            </button>
          </div>

          <Link
            to="/login"
            className="primary-button full-button"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
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

          <h1>Criar conta de gerente</h1>

          <p>
            Cadastre-se para acompanhar as férias
            da sua equipe.
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

          <button
            type="submit"
            className="primary-button full-button"
            disabled={loading}
          >
            {loading
              ? "Criando conta..."
              : "Criar conta de gerente"}
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