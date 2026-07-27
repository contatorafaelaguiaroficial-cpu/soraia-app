import Link from "next/link";
import {
  Bell,
  ChevronRight,
  CreditCard,
  KeyRound,
  Languages,
  LockKeyhole,
  Mail,
  Palette,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProfileLogoutButton from "@/components/profile/ProfileLogoutButton";
import "./perfil.css";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nome =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Rafael Aguiar";

  const email = user?.email || "Email não informado";

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const inicial = nome.charAt(0).toUpperCase();

  return (
    <main className="profile-page">
      <div className="profile-container">
        <Link href="/painel" className="profile-back-link">
          <span>←</span>
          Voltar ao painel
        </Link>
        <header className="profile-header">
          <div>
            <span className="profile-eyebrow">CONTA SORAIA</span>
            <h1>Seu perfil</h1>
            <p>
              Gerencie sua conta, preferências, segurança e assinatura.
            </p>
          </div>
        </header>

        <section className="profile-user-card">
          {avatar ? (
            <img
              src={avatar}
              alt={nome}
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar profile-avatar-fallback">
              {inicial}
            </div>
          )}

          <div className="profile-user-info">
            <h2>{nome}</h2>
            <p>{email}</p>
          </div>

          <div className="profile-plan">
            <span>Soraia Pro</span>
          </div>
        </section>

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

                <ShieldCheck size={18} className="profile-check" />
              </div>

              <button type="button" className="profile-row profile-row-button">
                <div className="profile-row-icon">
                  <UserRound size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>Informações pessoais</strong>
                  <span>Nome, foto e dados da conta</span>
                </div>

                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-title">
              <WalletCards size={18} />
              <h2>Assinatura</h2>
            </div>

            <div className="profile-list">
              <button type="button" className="profile-row profile-row-button">
                <div className="profile-row-icon">
                  <CreditCard size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>Plano Soraia Pro</strong>
                  <span>Gerencie sua assinatura e cobrança</span>
                </div>

                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-title">
              <Palette size={18} />
              <h2>Preferências</h2>
            </div>

            <div className="profile-list">
              <button type="button" className="profile-row profile-row-button">
                <div className="profile-row-icon">
                  <Bell size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>Notificações</strong>
                  <span>Controle avisos e lembretes</span>
                </div>

                <ChevronRight size={18} />
              </button>

              <button type="button" className="profile-row profile-row-button">
                <div className="profile-row-icon">
                  <Languages size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>Idioma e moeda</strong>
                  <span>Português e Real brasileiro</span>
                </div>

                <ChevronRight size={18} />
              </button>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-title">
              <LockKeyhole size={18} />
              <h2>Segurança</h2>
            </div>

            <div className="profile-list">
              <button type="button" className="profile-row profile-row-button">
                <div className="profile-row-icon">
                  <KeyRound size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>Senha e acesso</strong>
                  <span>Login, dispositivos e sessões</span>
                </div>

                <ChevronRight size={18} />
              </button>

              <button type="button" className="profile-row profile-row-button">
                <div className="profile-row-icon">
                  <LockKeyhole size={18} />
                </div>

                <div className="profile-row-content">
                  <strong>Privacidade e dados</strong>
                  <span>Controle seus dados na Soraia</span>
                </div>

                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        </div>

        <section className="profile-danger-zone">
          <div>
            <h2>Sessão</h2>
            <p>Encerre sua sessão neste dispositivo.</p>
          </div>

          <ProfileLogoutButton />
        </section>
      </div>
    </main>
  );
}
