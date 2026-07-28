import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EVENTOS_ATIVOS_CAKTO = [
  "purchase_approved",
  "subscription_created",
  "subscription_renewed",
];

function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

async function vincularCompraCakto(params: {
  userId: string;
  email: string;
}) {
  const { userId, email } = params;
  const admin = createAdminClient();
  const emailNormalizado = normalizarEmail(email);

  const { data: compra, error: erroCompra } = await admin
    .from("cakto_compras")
    .select(
      "id, assinatura_id, transacao_id, periodo_fim, evento, atualizada_em",
    )
    .eq("email", emailNormalizado)
    .in("evento", EVENTOS_ATIVOS_CAKTO)
    .order("atualizada_em", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (erroCompra) {
    console.error(
      "CAKTO_ERRO_AO_BUSCAR_COMPRA_PENDENTE",
      erroCompra,
    );
    return;
  }

  if (!compra) {
    return;
  }

  const agora = new Date().toISOString();

  const { error: erroPerfil } = await admin
    .from("profiles")
    .upsert(
      {
        id: userId,
        plano: "pro",
        status_assinatura: "active",
        assinatura_provedor: "cakto",
        assinatura_id:
          compra.assinatura_id ||
          compra.transacao_id ||
          null,
        assinatura_ativa_ate:
          compra.periodo_fim || null,
        assinatura_atualizada_em: agora,
      },
      {
        onConflict: "id",
      },
    );

  if (erroPerfil) {
    console.error(
      "CAKTO_ERRO_AO_ATIVAR_PERFIL_APOS_CADASTRO",
      erroPerfil,
    );
    return;
  }

  const { error: erroVinculo } = await admin
    .from("cakto_compras")
    .update({
      user_id: userId,
      atualizada_em: agora,
    })
    .eq("id", compra.id);

  if (erroVinculo) {
    console.error(
      "CAKTO_ERRO_AO_VINCULAR_COMPRA",
      erroVinculo,
    );
    return;
  }

  console.log(
    "CAKTO_COMPRA_VINCULADA_APOS_CADASTRO",
    JSON.stringify({
      userId,
      compraId: compra.id,
      evento: compra.evento,
    }),
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const nextParam =
    url.searchParams.get("next");

  const next =
    nextParam?.startsWith("/")
      ? nextParam
      : "/painel";

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code,
      );

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (
        user?.id &&
        user.email &&
        user.email_confirmed_at
      ) {
        await vincularCompraCakto({
          userId: user.id,
          email: user.email,
        });
      }

      return NextResponse.redirect(
        new URL(next, url.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      "/login?erro=nao-foi-possivel-autenticar",
      url.origin,
    ),
  );
}
