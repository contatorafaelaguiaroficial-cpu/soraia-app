import OpenAI from "openai";

const TAMANHO_MAXIMO = 10 * 1024 * 1024;

const TIPOS_PERMITIDOS = [
  "audio/webm",
  "audio/mp3",
  "audio/mpeg",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
];

export async function transcreverAudio(audio: File) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  if (!audio || audio.size === 0) {
    throw new Error("O arquivo de áudio está vazio.");
  }

  if (audio.size > TAMANHO_MAXIMO) {
    throw new Error("O áudio deve ter no máximo 10 MB.");
  }

  if (
    audio.type &&
    !TIPOS_PERMITIDOS.some((tipo) =>
      audio.type.toLowerCase().includes(tipo),
    )
  ) {
    throw new Error("Formato de áudio não suportado.");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const transcricao = await openai.audio.transcriptions.create({
    file: audio,
    model: "gpt-4o-mini-transcribe",
    language: "pt",
    prompt:
      "Transcreva em português do Brasil. Preserve valores financeiros, nomes, datas e estabelecimentos. Exemplos: R$ 35,00; mercado; aluguel; PIX.",
  });

  const texto = transcricao.text.trim();

  if (!texto) {
    throw new Error("Não foi possível entender o áudio.");
  }

  return texto;
}
