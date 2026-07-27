import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const TAMANHO_MAXIMO = 20 * 1024 * 1024;

const FORMATOS_PERMITIDOS = [
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/m4a",
  "audio/x-m4a",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          erro: "Você precisa estar conectado para enviar áudios.",
        },
        { status: 401 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          erro: "A chave da OpenAI ainda não foi configurada.",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        {
          erro: "Nenhum arquivo de áudio foi enviado.",
        },
        { status: 400 },
      );
    }

    if (audio.size === 0) {
      return NextResponse.json(
        {
          erro: "O áudio enviado está vazio.",
        },
        { status: 400 },
      );
    }

    if (audio.size > TAMANHO_MAXIMO) {
      return NextResponse.json(
        {
          erro: "O áudio é muito grande. Grave uma mensagem menor.",
        },
        { status: 413 },
      );
    }

    const tipoBase = audio.type.split(";")[0].toLowerCase();

    if (
      tipoBase &&
      !FORMATOS_PERMITIDOS.includes(tipoBase)
    ) {
      console.warn(
        `Tipo de áudio não reconhecido: ${audio.type}`,
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 1,
    });

    const transcricaoResultado =
      await openai.audio.transcriptions.create({
        file: audio,
        model: "gpt-4o-mini-transcribe",
        language: "pt",
        prompt:
          "Transcreva exatamente o áudio em português do Brasil. O assunto é finanças pessoais, receitas, despesas, valores em reais, datas, contas, compras e pagamentos.",
      });

    const transcricao =
      transcricaoResultado.text?.trim() ?? "";

    if (!transcricao) {
      return NextResponse.json(
        {
          erro: "Não consegui entender o áudio. Tente falar novamente.",
        },
        { status: 422 },
      );
    }

    const urlAssistente = new URL(
      "/api/assistente",
      request.url,
    );

    const cookie = request.headers.get("cookie");

    const respostaAssistente = await fetch(
      urlAssistente,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify({
          mensagem: transcricao,
          historico: [],
        }),
        cache: "no-store",
      },
    );

    const resultadoAssistente =
      await respostaAssistente.json();

    if (!respostaAssistente.ok) {
      return NextResponse.json(
        {
          transcricao,
          erro:
            resultadoAssistente.erro ||
            resultadoAssistente.error ||
            "O áudio foi transcrito, mas a Soraia não conseguiu responder.",
        },
        { status: respostaAssistente.status },
      );
    }

    return NextResponse.json({
      transcricao,
      resposta:
        resultadoAssistente.resposta ||
        "Entendi seu áudio, mas não consegui elaborar uma resposta.",
      indisponivel:
        resultadoAssistente.indisponivel ?? false,
    });
  } catch (error) {
    console.error(
      "Erro na rota de áudio da Soraia:",
      error,
    );

    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        {
          erro:
            "O limite da OpenAI está indisponível no momento. Verifique os créditos e o faturamento da API.",
        },
        { status: 429 },
      );
    }

    if (error instanceof OpenAI.AuthenticationError) {
      return NextResponse.json(
        {
          erro:
            "A chave da OpenAI não foi aceita. Verifique a OPENAI_API_KEY.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        erro:
          "Não foi possível processar o áudio. Tente novamente.",
      },
      { status: 500 },
    );
  }
}
