import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Verificação inicial do webhook pela Meta.
 *
 * URL de produção:
 * https://soraiapp.com.br/api/webhooks/whatsapp
 */
export async function GET(request: NextRequest) {
  const modo =
    request.nextUrl.searchParams.get("hub.mode");

  const tokenRecebido =
    request.nextUrl.searchParams.get(
      "hub.verify_token",
    );

  const desafio =
    request.nextUrl.searchParams.get(
      "hub.challenge",
    );

  const tokenConfigurado =
    process.env.WHATSAPP_VERIFY_TOKEN;

  if (
    modo === "subscribe" &&
    tokenConfigurado &&
    tokenRecebido === tokenConfigurado &&
    desafio
  ) {
    return new NextResponse(desafio, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  console.warn("WHATSAPP_WEBHOOK_VERIFICACAO_NEGADA", {
    modo,
    possuiTokenConfigurado: Boolean(
      tokenConfigurado,
    ),
    tokenConfere:
      Boolean(tokenConfigurado) &&
      tokenRecebido === tokenConfigurado,
    possuiDesafio: Boolean(desafio),
  });

  return NextResponse.json(
    {
      verificado: false,
      erro: "Verificação não autorizada.",
    },
    { status: 403 },
  );
}

/**
 * Nesta primeira etapa apenas confirmamos o recebimento.
 * O processamento de texto, áudio e imagem será adicionado
 * depois da validação do webhook na Meta.
 */
export async function POST() {
  return NextResponse.json({
    recebido: true,
  });
}
