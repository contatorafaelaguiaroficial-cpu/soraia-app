import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const segredoConfigurado =
    process.env.CAKTO_WEBHOOK_SECRET;

  const segredoRecebido =
    request.nextUrl.searchParams.get("token");

  if (
    !segredoConfigurado ||
    segredoRecebido !== segredoConfigurado
  ) {
    return NextResponse.json(
      { recebido: false, erro: "Não autorizado" },
      { status: 401 },
    );
  }

  try {
    const payload = await request.json();

    console.log(
      "CAKTO_WEBHOOK_TESTE",
      JSON.stringify(payload),
    );

    return NextResponse.json(
      {
        recebido: true,
        mensagem: "Evento recebido pela Soraia",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        recebido: false,
        erro: "JSON inválido",
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ativo: true,
    webhook: "cakto",
  });
}
