import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type Objeto = Record<string, unknown>;

function comoObjeto(valor: unknown): Objeto {
  if (
    valor &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  ) {
    return valor as Objeto;
  }

  return {};
}

function comoTexto(valor: unknown) {
  return typeof valor === "string"
    ? valor.trim()
    : "";
}

function comoNumero(valor: unknown) {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : null;
}

function normalizarEmail(valor: unknown) {
  return comoTexto(valor).toLowerCase();
}

function adicionarDias(
  dataBase: string,
  quantidadeDias: number,
) {
  const data = new Date(dataBase);

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  data.setUTCDate(
    data.getUTCDate() + quantidadeDias,
  );

  return data.toISOString();
}

async function encontrarUsuarioPorEmail(
  email: string,
) {
  const supabase = createAdminClient();

  /*
   * Solução adequada para o MVP.
   * Depois, com uma base maior, substituímos por uma
   * tabela própria de associação de e-mail e usuário.
   */
  for (let pagina = 1; pagina <= 10; pagina += 1) {
    const { data, error } =
      await supabase.auth.admin.listUsers({
        page: pagina,
        perPage: 1000,
      });

    if (error) {
      throw error;
    }

    const usuario = data.users.find(
      (item) =>
        item.email?.trim().toLowerCase() === email,
    );

    if (usuario) {
      return usuario;
    }

    if (data.users.length < 1000) {
      break;
    }
  }

  return null;
}

export async function POST(
  request: NextRequest,
) {
  const segredoConfigurado =
    process.env.CAKTO_WEBHOOK_SECRET;

  const segredoRecebido =
    request.nextUrl.searchParams.get("token");

  if (
    !segredoConfigurado ||
    segredoRecebido !== segredoConfigurado
  ) {
    return NextResponse.json(
      {
        recebido: false,
        erro: "Não autorizado",
      },
      { status: 401 },
    );
  }

  let payload: Objeto;

  try {
    payload = comoObjeto(await request.json());
  } catch {
    return NextResponse.json(
      {
        recebido: false,
        erro: "JSON inválido",
      },
      { status: 400 },
    );
  }

  const evento = comoTexto(payload.event);
  const dados = comoObjeto(payload.data);

  const cliente = comoObjeto(dados.customer);
  const produto = comoObjeto(dados.product);
  const oferta = comoObjeto(dados.offer);
  const assinatura = comoObjeto(
    dados.subscription,
  );

  const email = normalizarEmail(cliente.email);

  if (!evento || !email) {
    console.error(
      "CAKTO_WEBHOOK_INCOMPLETO",
      JSON.stringify({
        evento,
        possuiEmail: Boolean(email),
      }),
    );

    return NextResponse.json(
      {
        recebido: false,
        erro: "Evento ou e-mail não informado",
      },
      { status: 400 },
    );
  }

  const pedidoId =
    comoTexto(dados.id) ||
    comoTexto(dados.refId);

  const assinaturaId =
    comoTexto(assinatura.id);

  /*
   * Une o tipo do evento ao pedido para que uma compra
   * e um reembolso do mesmo pedido sejam eventos distintos.
   */
  const eventoId = [
    evento,
    pedidoId,
    assinaturaId,
    comoTexto(dados.paidAt),
  ]
    .filter(Boolean)
    .join(":");

  const eventosAtivos = new Set([
    "purchase_approved",
    "subscription_created",
    "subscription_renewed",
  ]);

  const eventosCancelados = new Set([
    "subscription_canceled",
    "refund",
    "chargeback",
  ]);

  const eventosInadimplentes = new Set([
    "subscription_renewal_refused",
  ]);

  let plano = "free";
  let statusAssinatura = "inactive";

  if (eventosAtivos.has(evento)) {
    plano = "pro";
    statusAssinatura = "active";
  } else if (eventosCancelados.has(evento)) {
    plano = "free";
    statusAssinatura = "canceled";
  } else if (eventosInadimplentes.has(evento)) {
    plano = "pro";
    statusAssinatura = "past_due";
  }

  const periodoEmDias =
    comoNumero(assinatura.recurrence_period) ??
    30;

  const dataPagamento =
    comoTexto(dados.paidAt) ||
    comoTexto(dados.createdAt);

  const ativaAte =
    eventosAtivos.has(evento) && dataPagamento
      ? adicionarDias(
          dataPagamento,
          periodoEmDias,
        )
      : null;

  const usuario =
    await encontrarUsuarioPorEmail(email);

  const supabase = createAdminClient();
  const agora = new Date().toISOString();

  const registroCompra = {
    email,
    user_id: usuario?.id ?? null,

    evento_id:
      eventoId ||
      `${evento}:${email}:${agora}`,

    evento,
    status:
      comoTexto(dados.status) ||
      comoTexto(assinatura.status) ||
      statusAssinatura,

    transacao_id: pedidoId || null,
    assinatura_id: assinaturaId || null,

    produto_id:
      comoTexto(produto.id) || null,

    oferta_id:
      comoTexto(oferta.id) || null,

    valor:
      comoNumero(dados.amount),

    moeda: "BRL",

    periodo_inicio:
      dataPagamento || null,

    periodo_fim:
      ativaAte,

    payload,

    atualizada_em: agora,
  };

  const { error: erroCompra } =
    await supabase
      .from("cakto_compras")
      .upsert(registroCompra, {
        onConflict: "evento_id",
        ignoreDuplicates: false,
      });

  if (erroCompra) {
    console.error(
      "CAKTO_ERRO_AO_REGISTRAR_COMPRA",
      erroCompra,
    );

    return NextResponse.json(
      {
        recebido: false,
        erro: "Não foi possível registrar o evento",
      },
      { status: 500 },
    );
  }

  if (usuario) {
    const atualizacaoPerfil: Objeto = {
      plano,
      status_assinatura: statusAssinatura,
      assinatura_provedor: "cakto",
      assinatura_id:
        assinaturaId || pedidoId || null,
      assinatura_atualizada_em: agora,
    };

    if (ativaAte) {
      atualizacaoPerfil.assinatura_ativa_ate =
        ativaAte;
    }

    if (eventosCancelados.has(evento)) {
      atualizacaoPerfil.assinatura_ativa_ate =
        agora;
    }

    const { error: erroPerfil } =
      await supabase
        .from("profiles")
        .update(atualizacaoPerfil)
        .eq("id", usuario.id);

    if (erroPerfil) {
      console.error(
        "CAKTO_ERRO_AO_ATUALIZAR_PERFIL",
        erroPerfil,
      );

      return NextResponse.json(
        {
          recebido: false,
          erro:
            "Evento salvo, mas o perfil não foi atualizado",
        },
        { status: 500 },
      );
    }
  }

  console.log(
    "CAKTO_WEBHOOK_PROCESSADO",
    JSON.stringify({
      evento,
      pedidoId,
      assinaturaId,
      usuarioEncontrado: Boolean(usuario),
      plano,
      statusAssinatura,
    }),
  );

  return NextResponse.json(
    {
      recebido: true,
      processado: true,
      usuarioEncontrado: Boolean(usuario),
      plano,
      statusAssinatura,
    },
    { status: 200 },
  );
}

export async function GET() {
  return NextResponse.json({
    ativo: true,
    webhook: "cakto",
    versao: "assinaturas",
  });
}
