"use client";

import { FormEvent, useState } from "react";
import "./SoraiaLogin.css";

type Mode = "login" | "signup";

interface SoraiaLoginProps {
  onEmailLogin?: (email: string, password: string) => Promise<void> | void;
  onGoogleLogin?: () => Promise<void> | void;
  onForgotPassword?: (email: string) => Promise<void> | void;
}

export default function SoraiaLogin({
  onEmailLogin,
  onGoogleLogin,
  onForgotPassword,
}: SoraiaLoginProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [message, setMessage] = useState("");

  const loginSteps = [
    ["Soraia está preparando seu ambiente...", "Organizando sua experiência."],
    ["Verificando sua rotina financeira...", "Isso leva apenas alguns segundos."],
    ["Tudo pronto.", "Bem-vindo de volta."],
  ];

  const signupSteps = [
    ["Criando seu espaço inteligente...", "Preparando uma experiência personalizada."],
    ["Configurando sua assistente...", "A Soraia está quase pronta."],
    ["Conta criada.", "Vamos organizar sua vida."],
  ];

  const runLoadingSequence = async () => {
    const steps = mode === "login" ? loginSteps : signupSteps;
    setLoading(true);
    setLoadingStep(0);

    for (let index = 0; index < steps.length; index += 1) {
      setLoadingStep(index);
      await new Promise((resolve) => window.setTimeout(resolve, 850));
    }

    setLoading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    try {
      await runLoadingSequence();

      if (onEmailLogin) {
        await onEmailLogin(email, password);
      } else {
        setMessage(
          mode === "login"
            ? "Login demonstrativo concluído."
            : "Cadastro demonstrativo concluído."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir o acesso."
      );
    }
  };

  const handleGoogleLogin = async () => {
    setMessage("");

    try {
      if (onGoogleLogin) {
        await onGoogleLogin();
      } else {
        setMessage("Integração com Google pronta para conectar ao Supabase.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar com o Google."
      );
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Digite seu e-mail para redefinir a senha.");
      return;
    }

    try {
      if (onForgotPassword) {
        await onForgotPassword(email);
      } else {
        setMessage("Enviaremos um link para redefinir sua senha.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar a redefinição."
      );
    }
  };

  const currentSteps = mode === "login" ? loginSteps : signupSteps;

  return (
    <main className="soraia-page">
      <div className="soraia-ambient" aria-hidden="true">
        <div className="soraia-blob soraia-blob-one" />
        <div className="soraia-blob soraia-blob-two" />
        <div className="soraia-blob soraia-blob-three" />
      </div>

      <section className="soraia-shell">
        <aside className="soraia-showcase">
          <div className="soraia-brand">
            <SoraiaMark />
            <span>Soraia</span>
          </div>

          <div className="soraia-hero">
            <div className="soraia-eyebrow">
              <span className="soraia-live-dot" />
              Inteligência ativa
            </div>

            <h1>
              Uma assistente que{" "}
              <span className="soraia-gradient-text">entende sua vida.</span>
            </h1>

            <p>
              A Soraia organiza suas finanças, antecipa compromissos e
              transforma seus dados em decisões mais inteligentes.
            </p>
          </div>

          <div className="soraia-intelligence" aria-hidden="true">
            <div className="soraia-orbit" />

            <div className="soraia-brain">
              <BrainIcon />
            </div>

            <span className="soraia-particle soraia-p1" />
            <span className="soraia-particle soraia-p2" />
            <span className="soraia-particle soraia-p3" />
            <span className="soraia-particle soraia-p4" />

            <article className="soraia-insight-card soraia-card-one">
              <div className="soraia-insight-top">
                <span className="soraia-insight-label">Análise concluída</span>
                <span className="soraia-tag">agora</span>
              </div>
              <strong>Você gastou 14% menos nesta semana.</strong>
              <small>Seu ritmo está mais saudável.</small>
            </article>

            <article className="soraia-insight-card soraia-card-two">
              <div className="soraia-insight-top">
                <span className="soraia-insight-label">
                  Previsão inteligente
                </span>
              </div>
              <strong>Economia estimada: R$ 620</strong>
              <small>Mantendo o comportamento atual.</small>
              <div className="soraia-progress">
                <span />
              </div>
            </article>

            <article className="soraia-insight-card soraia-card-three">
              <div className="soraia-insight-top">
                <span className="soraia-insight-label">
                  Próximo compromisso
                </span>
              </div>
              <strong>Aluguel vence amanhã</strong>
              <small>A Soraia pode lembrar você.</small>
            </article>
          </div>
        </aside>

        <section className="soraia-login-area">
          <div className="soraia-login-card">
            <div className="soraia-mobile-brand">
              <SoraiaMark />
              <span>Soraia</span>
            </div>

            <header className="soraia-login-header">
              <h2>{mode === "login" ? "Bem-vindo de volta" : "Vamos começar"}</h2>
              <p>
                {mode === "login"
                  ? "Entre para continuar sua jornada com a Soraia."
                  : "Crie sua conta e deixe a Soraia entender sua rotina."}
              </p>
            </header>

            <div className="soraia-tabs" role="tablist">
              <button
                type="button"
                className={`soraia-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Entrar
              </button>

              <button
                type="button"
                className={`soraia-tab ${mode === "signup" ? "active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Começar agora
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="soraia-field">
                <div className="soraia-field-head">
                  <label htmlFor="email">E-mail</label>
                </div>

                <div className="soraia-input-wrap">
                  <MailIcon />
                  <input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="soraia-field">
                <div className="soraia-field-head">
                  <label htmlFor="password">Senha</label>

                  <button
                    className="soraia-forgot"
                    type="button"
                    onClick={handleForgotPassword}
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="soraia-input-wrap">
                  <LockIcon />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button
                    className="soraia-toggle-password"
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <EyeIcon />
                  </button>
                </div>
              </div>

              <button className="soraia-primary" type="submit">
                {mode === "login" ? "Entrar" : "Criar minha conta"}
              </button>
            </form>

            <div className="soraia-divider">ou</div>

            <button
              className="soraia-google"
              type="button"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />
              Entrar com Google
            </button>

            {message && <div className="soraia-message">{message}</div>}

            <div className="soraia-security">
              <ShieldIcon />
              <span>
                Seus dados são protegidos. A Soraia usa suas informações apenas
                para personalizar sua experiência.
              </span>
            </div>

            <p className="soraia-terms">
              Ao continuar, você concorda com os{" "}
              <a href="/termos">Termos de Uso</a> e a{" "}
              <a href="/privacidade">Política de Privacidade</a>.
            </p>
          </div>
        </section>
      </section>

      <div className={`soraia-loading-overlay ${loading ? "show" : ""}`}>
        <div className="soraia-loading-box">
          <div className="soraia-loader-orb">
            <SoraiaIcon />
          </div>
          <h3>{currentSteps[loadingStep][0]}</h3>
          <p>{currentSteps[loadingStep][1]}</p>
        </div>
      </div>
    </main>
  );
}

function SoraiaMark() {
  return (
    <div className="soraia-mark" aria-hidden="true">
      <SoraiaIcon />
    </div>
  );
}

function SoraiaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M6 15.5c2.6 0 3.9-1.2 4.3-3.5.5-2.8.8-4.5 1.7-4.5.9 0 1.2 1.7 1.7 4.5.4 2.3 1.7 3.5 4.3 3.5M12 4v2M19 6l-1.4 1.4M5 6l1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M8.2 5.8a3.4 3.4 0 0 1 6.5 1.4A3.1 3.1 0 0 1 17 12.4a3.4 3.4 0 0 1-2.6 5.5A3.1 3.1 0 0 1 9 18a3.4 3.4 0 0 1-2.3-5.9A3.2 3.2 0 0 1 8.2 5.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.6 8.1c.2 1.1 1 1.7 2.4 1.7M14.4 15.8c-.2-1.1-1-1.7-2.4-1.7M12 9.8v4.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m5 7.5 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 10h11v9h-11v-9Z" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9 10V7.8a3 3 0 1 1 6 0V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M2.8 12s3.2-5 9.2-5 9.2 5 9.2 5-3.2 5-9.2 5-9.2-5-9.2-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 6v5c0 4.5 2.7 8.2 7 10 4.3-1.8 7-5.5 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.2c0-.7-.06-1.2-.2-1.8H12v3.4h5.36a4.6 4.6 0 0 1-1.99 3v2.5h3.22c1.88-1.74 2.76-4.3 2.76-7.1Z"
      />
      <path
        fill="#34A853"
        d="M12 21.7c2.7 0 4.95-.9 6.6-2.4l-3.23-2.5c-.9.6-2.04.96-3.37.96-2.6 0-4.8-1.76-5.6-4.13H3.08v2.58A9.97 9.97 0 0 0 12 21.7Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.63a6 6 0 0 1 0-3.84V7.21H3.08a9.98 9.98 0 0 0 0 9l3.32-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.66c1.47 0 2.78.5 3.82 1.5l2.85-2.86C16.94 2.69 14.69 1.7 12 1.7a9.97 9.97 0 0 0-8.92 5.51L6.4 9.79C7.2 7.42 9.4 5.66 12 5.66Z"
      />
    </svg>
  );
}
