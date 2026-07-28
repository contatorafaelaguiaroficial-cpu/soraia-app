"use client";

import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  KeyRound,
  Languages,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type ProfileSettingsProps = {
  nomeInicial: string;
  email: string;
  plano: "free" | "pro";
  statusAssinatura: string;
};

export default function ProfileSettings({
  nomeInicial,
  email,
  plano,
  statusAssinatura,
}: ProfileSettingsProps) {
  const router = useRouter();

  const [editandoNome, setEditandoNome] =
    useState(false);

  const [nome, setNome] =
    useState(nomeInicial);

  const [salvandoNome, setSalvandoNome] =
    useState(false);

  const [nomeSalvo, setNomeSalvo] =
    useState(false);

  const [editandoSenha, setEditandoSenha] =
    useState(false);

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [salvandoSenha, setSalvandoSenha] =
    useState(false);

  const [senhaSalva, setSenhaSalva] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  async function salvarNome() {
    const nomeLimpo = nome.trim();

    if (nomeLimpo.length < 2) {
      setErro(
        "Informe um nome com pelo menos 2 caracteres.",
      );
      return;
    }

    setSalvandoNome(true);
    setErro(null);
    setNomeSalvo(false);

    const supabase = createClient();

    const { error } =
      await supabase.auth.updateUser({
        data: {
          full_name: nomeLimpo,
          name: nomeLimpo,
        },
      });

    setSalvandoNome(false);

    if (error) {
      setErro(
        "Não foi possível atualizar seu nome.",
      );
      return;
    }

    setNome(nomeLimpo);
    setNomeSalvo(true);
    setEditandoNome(false);

    router.refresh();

    window.setTimeout(
      () => setNomeSalvo(false),
      2500,
    );
  }

  async function salvarSenha() {
    if (senha.length < 6) {
      setErro(
        "A nova senha precisa ter pelo menos 6 caracteres.",
      );
      return;
    }

    if (senha !== confirmar) {
      setErro(
        "As senhas informadas não são iguais.",
      );
      return;
    }

    setSalvandoSenha(true);
    setErro(null);
    setSenhaSalva(false);

    const supabase = createClient();

    const { error } =
      await supabase.auth.updateUser({
        password: senha,
      });

    setSalvandoSenha(false);

    if (error) {
      setErro(
        "Não foi possível alterar sua senha.",
      );
      return;
    }

    setSenha("");
    setConfirmar("");
    setSenhaSalva(true);
    setEditandoSenha(false);

    window.setTimeout(
      () => setSenhaSalva(false),
      2500,
    );
  }

  return (
    <>
      {erro && (
        <div className="profile-feedback profile-feedback-error">
          {erro}
          <button
            type="button"
            onClick={() => setErro(null)}
            aria-label="Fechar aviso"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {(nomeSalvo || senhaSalva) && (
        <div className="profile-feedback profile-feedback-success">
          <Check size={16} />
          {nomeSalvo
            ? "Nome atualizado com sucesso."
            : "Senha alterada com sucesso."}
        </div>
      )}

      <div className="profile-grid">
        <section className="profile-section">
          <div className="profile-section-title">
            <UserRound size={18} />
            <h2>Conta</h2>
          </div>

          <div className="profile-list">
            <div className="profile-row">
              <div className="profile-row-icon">
                <Mail size={18} />
              </div>

              <div className="profile-row-content">
                <strong>Email</strong>
                <span>{email}</span>
              </div>

              <ShieldCheck
                size={18}
                className="profile-check"
              />
            </div>

            {!editandoNome ? (
              <button
                type="button"
                className="profile-row profile-row-button"
                onClick={() =>
                  setEditandoNome(true)
                }
              >
                <div className="profile-row-icon">
                  <UserRound size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>
                    Informações pessoais
                  </strong>
                  <span>
                    Altere o nome exibido na conta
                  </span>
                </div>

                <ChevronRight size={18} />
              </button>
            ) : (
              <div className="profile-inline-form">
                <label htmlFor="profile-name">
                  Nome
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={nome}
                  maxLength={80}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                />

                <div className="profile-inline-actions">
                  <button
                    type="button"
                    className="profile-secondary-button"
                    onClick={() => {
                      setNome(nomeInicial);
                      setEditandoNome(false);
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="profile-primary-button"
                    disabled={salvandoNome}
                    onClick={salvarNome}
                  >
                    {salvandoNome
                      ? "Salvando..."
                      : "Salvar nome"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-title">
            <WalletCards size={18} />
            <h2>Assinatura</h2>
          </div>

          <div className="profile-list">
            <div className="profile-row">
              <div className="profile-row-icon">
                <CreditCard size={18} />
              </div>

              <div className="profile-row-content">
                <strong>
                  {plano === "pro"
                    ? "Plano Soraia Pro"
                    : "Plano Soraia Free"}
                </strong>
                <span>
                  {plano === "pro"
                    ? statusAssinatura === "active"
                      ? "Sua assinatura está ativa"
                      : "Confira o status da sua assinatura"
                    : "Você está usando o plano gratuito"}
                </span>
              </div>

              <span className="profile-coming-soon">
                {plano === "pro"
                  ? "Ativo"
                  : "Free"}
              </span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-title">
            <Bell size={18} />
            <h2>Preferências</h2>
          </div>

          <div className="profile-list">
            <div className="profile-row">
              <div className="profile-row-icon">
                <Bell size={18} />
              </div>

              <div className="profile-row-content">
                <strong>Notificações</strong>
                <span>
                  Avisos e lembretes financeiros
                </span>
              </div>

              <span className="profile-coming-soon">
                Em breve
              </span>
            </div>

            <div className="profile-row">
              <div className="profile-row-icon">
                <Languages size={18} />
              </div>

              <div className="profile-row-content">
                <strong>Idioma e moeda</strong>
                <span>
                  Português do Brasil · Real brasileiro
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-title">
            <LockKeyhole size={18} />
            <h2>Segurança</h2>
          </div>

          <div className="profile-list">
            {!editandoSenha ? (
              <button
                type="button"
                className="profile-row profile-row-button"
                onClick={() =>
                  setEditandoSenha(true)
                }
              >
                <div className="profile-row-icon">
                  <KeyRound size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>Alterar senha</strong>
                  <span>
                    Defina uma nova senha de acesso
                  </span>
                </div>

                <ChevronRight size={18} />
              </button>
            ) : (
              <div className="profile-inline-form">
                <label htmlFor="profile-password">
                  Nova senha
                </label>

                <div className="profile-password-field">
                  <input
                    id="profile-password"
                    type={
                      mostrarSenha
                        ? "text"
                        : "password"
                    }
                    value={senha}
                    minLength={6}
                    placeholder="Mínimo de 6 caracteres"
                    onChange={(event) =>
                      setSenha(
                        event.target.value,
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarSenha(
                        (atual) => !atual,
                      )
                    }
                    aria-label={
                      mostrarSenha
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                <label htmlFor="profile-password-confirm">
                  Confirmar nova senha
                </label>

                <input
                  id="profile-password-confirm"
                  type={
                    mostrarSenha
                      ? "text"
                      : "password"
                  }
                  value={confirmar}
                  minLength={6}
                  onChange={(event) =>
                    setConfirmar(
                      event.target.value,
                    )
                  }
                />

                <div className="profile-inline-actions">
                  <button
                    type="button"
                    className="profile-secondary-button"
                    onClick={() => {
                      setSenha("");
                      setConfirmar("");
                      setEditandoSenha(false);
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="profile-primary-button"
                    disabled={salvandoSenha}
                    onClick={salvarSenha}
                  >
                    {salvandoSenha
                      ? "Salvando..."
                      : "Alterar senha"}
                  </button>
                </div>
              </div>
            )}

            <div className="profile-row">
              <div className="profile-row-icon">
                <LockKeyhole size={18} />
              </div>

              <div className="profile-row-content">
                <strong>
                  Privacidade e dados
                </strong>
                <span>
                  Exportação e exclusão dos dados
                </span>
              </div>

              <span className="profile-coming-soon">
                Em breve
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
