import { NextResponse } from "next/server";
import OpenAI from "openai";

import { processarMensagem } from "@/lib/soraia/engine";
import { transcreverAudio } from "@/lib/soraia/transcribe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

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
          error: "Você precisa estar conectado.",
        },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return NextResponse.json(
        {
          error: "Envie um arquivo no campo audio.",
        },
        { status: 400 },
      );
    }

    const transcricao = await transcreverAudio(audio);

    const resultado = await processarMensagem({
      mensagem: transcricao,
      userId: user.id,
      origem: "app_audio",
      supabase,
    });

    return NextResponse.json({
      ...resultado,
      transcricao,
    });
  } catch (error) {
    console.error("Erro ao processar áudio:", error);

    if (error instanceof OpenAI.AuthenticationError) {
      return NextResponse.json(
        {
          resposta:
            "A configuração do assistente precisa ser atualizada.",
        },
        { status: 500 },
      );
    }

    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        {
          resposta:
            "O serviço de áudio está temporariamente com uso elevado.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        resposta:
          error instanceof Error
            ? error.message
            : "Não foi possível processar o áudio.",
      },
      { status: 500 },
    );
  }
}
