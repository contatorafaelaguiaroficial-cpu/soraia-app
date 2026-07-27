import Link from "next/link";
import ProfileSettings from "@/components/profile/ProfileSettings";
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
            <span>Soraia Free</span>
          </div>
        </section>

        <ProfileSettings
          nomeInicial={nome}
          email={email}
        />

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
