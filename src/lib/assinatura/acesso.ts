import type { SupabaseClient } from "@supabase/supabase-js";

type PerfilAssinatura = {
  plano: string | null;
  status_assinatura: string | null;
  assinatura_ativa_ate: string | null;
};

export type AcessoSoraia = {
  plano: "free" | "pro";
  proAtivo: boolean;
  statusAssinatura: string;
};

function assinaturaAindaValida(
  ativaAte: string | null,
) {
  if (!ativaAte) {
    return true;
  }

  const dataFinal = new Date(ativaAte);

  if (Number.isNaN(dataFinal.getTime())) {
    return false;
  }

  return dataFinal.getTime() > Date.now();
}

export async function obterAcessoSoraia(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<AcessoSoraia> {
  const { supabase, userId } = params;

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "plano, status_assinatura, assinatura_ativa_ate",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error(
      "Erro ao verificar plano do usuário:",
      error,
    );

    return {
      plano: "free",
      proAtivo: false,
      statusAssinatura: "inactive",
    };
  }

  const perfil = data as PerfilAssinatura | null;

  const plano = perfil?.plano === "pro"
    ? "pro"
    : "free";

  const statusAssinatura =
    perfil?.status_assinatura || "inactive";

  const statusPermiteAcesso =
    statusAssinatura === "active" ||
    statusAssinatura === "past_due";

  const proAtivo =
    plano === "pro" &&
    statusPermiteAcesso &&
    assinaturaAindaValida(
      perfil?.assinatura_ativa_ate || null,
    );

  return {
    plano: proAtivo ? "pro" : "free",
    proAtivo,
    statusAssinatura,
  };
}
