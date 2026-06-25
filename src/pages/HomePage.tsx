import {
  CalendarDays,
  User,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="public-page">
      <header className="public-header">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <CalendarDays size={24} />
          </div>

          <span>Vacation Scheduler</span>
        </Link>

        <nav className="public-navigation">
          <Link to="/login" className="link-button">
            Entrar
          </Link>

          <Link
            to="/register/employee"
            className="primary-button small-button"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-label">
              Gestão de férias simplificada
            </span>

            <h1>
              Organize suas férias de forma simples
              e eficiente.
            </h1>

            <p>
              Funcionários podem cadastrar seus
              períodos de descanso e gerentes
              acompanham toda a equipe em um único
              lugar.
            </p>

            <div className="hero-actions">
              <Link
                to="/login"
                className="primary-button"
              >
                Entrar na plataforma
              </Link>

              <a href="#cadastro" className="secondary-button">
                Criar uma conta
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="calendar-card">
              <div className="calendar-card-header">
                <CalendarDays size={28} />
                <div>
                  <strong>Próximas férias</strong>
                  <span>Planejamento da equipe</span>
                </div>
              </div>

              <div className="calendar-event">
                <div className="calendar-day">
                  <strong>15</strong>
                  <span>JUL</span>
                </div>

                <div>
                  <strong>Período agendado</strong>
                  <span>15/07 até 30/07</span>
                </div>
              </div>

              <div className="calendar-status">
                <span className="status-dot" />
                Tudo organizado
              </div>
            </div>
          </div>
        </section>

        <section
          id="cadastro"
          className="registration-section"
        >
          <div className="section-heading">
            <span>Comece agora</span>
            <h2>Como deseja utilizar o sistema?</h2>
            <p>
              Escolha o tipo de conta adequado ao seu
              perfil.
            </p>
          </div>

          <div className="profile-grid">
            <article className="profile-card">
              <div className="profile-icon">
                <User size={30} />
              </div>

              <h3>Sou funcionário</h3>

              <p>
                Utilize o código fornecido pelo seu
                gerente para criar sua conta e
                cadastrar suas férias.
              </p>

              <Link
                to="/register/employee"
                className="primary-button full-button"
              >
                Criar conta de funcionário
              </Link>
            </article>

            <article className="profile-card">
              <div className="profile-icon">
                <Users size={30} />
              </div>

              <h3>Sou gerente</h3>

              <p>
                Crie sua conta, receba um código
                exclusivo e acompanhe as férias da
                sua equipe.
              </p>

              <Link
                to="/register/manager"
                className="primary-button full-button"
              >
                Criar conta de gerente
              </Link>
            </article>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <span>
          © {new Date().getFullYear()} Vacation
          Scheduler
        </span>

        <span>Organização e praticidade para sua equipe.</span>
      </footer>
    </div>
  );
}

