"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UsuarioCard = {
  nome: string;
  avatar: string | null;
  plano: "free" | "pro";
};

export default function UserProfileCard() {
  const [usuario, setUsuario] = useState<UsuarioCard>({
    nome: "Usuário",
    avatar: null,
    plano: "free",
  });

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !ativo) return;

      const nomeCompleto =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Usuário";

      const avatar =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;

      const { data: perfil } = await supabase
        .from("profiles")
        .select("plano")
        .eq("id", user.id)
        .maybeSingle();

      if (!ativo) return;

      setUsuario({
        nome: nomeCompleto,
        avatar,
        plano:
          perfil?.plano === "pro"
            ? "pro"
            : "free",
      });
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  const inicial = usuario.nome.charAt(0).toUpperCase();

  return (
    <Link href="/perfil" className="sidebar-user-link">
      <div className="sidebar-user-card">
        {usuario.avatar ? (
          <img
            src={usuario.avatar}
            alt={usuario.nome}
            className="sidebar-user-avatar"
          />
        ) : (
          <div className="sidebar-user-avatar sidebar-user-avatar-fallback">
            {inicial}
          </div>
        )}

        <div className="sidebar-user-content">
          <strong>{usuario.nome.split(' ')[0]}</strong>
          <span>
            {usuario.plano === "pro"
              ? "Plano Pro"
              : "Plano Free"}
          </span>
        </div>

        <ChevronRight
          className="sidebar-user-arrow"
          size={18}
        />
      </div>
    </Link>
  );
}
