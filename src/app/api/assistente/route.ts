import { NextResponse } from "next/server";
import OpenAI from "openai";

import { processarMensagem } from "@/lib/soraia/engine";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mensagem = String(body?.mensagem ?? "").trim();

    const historico = Array.isArray(body?.historico)
      ? body.historico
          .filter(
            (item: unknown): item is {
              role: "user" | "assistant";
              content: string;
            } =>
              typeof item === "object" &&
              item !== null &&
              "role" in item &&
              "content" in item &&
              (item.role === "user" ||
                item.role === "assistant") &&
              typeof item.content === "string",
          )
          .slice(-8)
      : [];

    if (!mensagem) {
      return NextResponse.json(
        {
          error: "Digite uma mensagem para conversar com a Soraia.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Você precisa estar conectado.",
        },
        { status: 401 },
      );
    }

    const resultado = await processarMensagem({
      mensagem,
      userId: user.id,
      origem: "app_texto",
      supabase,
      historico,
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro no assistente:", error);

    if (error instanceof OpenAI.AuthenticationError) {
      return NextResponse.json(
        {
          resposta:
            "A configuração do assistente precisa ser atualizada.",
          indisponivel: true,
        },
        { status: 500 },
      );
    }

    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        {
          resposta:
            "O assistente está temporariamente com uso elevado.",
          indisponivel: true,
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        resposta:
          error instanceof Error
            ? error.message
            : "Não consegui processar sua solicitação agora.",
      },
      { status: 500 },
    );
  }
}
