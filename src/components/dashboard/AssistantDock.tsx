"use client";

import {
  LoaderCircle,
  Mic,
  Square,
} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AssistantDock({
  collapsed,
}: {
  collapsed: boolean;
}) {
  const [message, setMessage] = useState("");
  const [gravando, setGravando] = useState(false);
  const [processandoAudio, setProcessandoAudio] =
    useState(false);

  const router = useRouter();

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  function submit() {
    const texto = message.trim();

    if (!texto) {
      router.push("/painel/assistente");
      return;
    }

    router.push(
      `/painel/assistente?mensagem=${encodeURIComponent(
        texto,
      )}`,
    );

    setMessage("");
  }

  function pararTracks() {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;
  }

  async function iniciarGravacao() {
    if (gravando || processandoAudio) return;

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = "";

      if (
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus",
        )
      ) {
        mimeType = "audio/webm;codecs=opus";
      } else if (
        MediaRecorder.isTypeSupported("audio/webm")
      ) {
        mimeType = "audio/webm";
      } else if (
        MediaRecorder.isTypeSupported("audio/mp4")
      ) {
        mimeType = "audio/mp4";
      }

      const gravador = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = gravador;

      gravador.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      gravador.onstop = async () => {
        pararTracks();
        setGravando(false);

        if (audioChunksRef.current.length === 0) {
          return;
        }

        const tipo =
          gravador.mimeType || "audio/webm";

        const blob = new Blob(
          audioChunksRef.current,
          {
            type: tipo,
          },
        );

        audioChunksRef.current = [];

        await enviarAudio(blob);
      };

      gravador.start(250);
      setGravando(true);
    } catch (error) {
      console.error(
        "Não foi possível acessar o microfone:",
        error,
      );

      pararTracks();
      setGravando(false);
      router.push("/painel/assistente");
    }
  }

  function finalizarGravacao() {
    const gravador = mediaRecorderRef.current;

    if (
      gravador &&
      gravador.state === "recording"
    ) {
      gravador.stop();
    }
  }

  async function enviarAudio(blob: Blob) {
    setProcessandoAudio(true);

    try {
      const extensao = blob.type.includes("mp4")
        ? "mp4"
        : "webm";

      const arquivo = new File(
        [blob],
        `audio-soraia-${Date.now()}.${extensao}`,
        {
          type: blob.type,
        },
      );

      const formData = new FormData();
      formData.append("audio", arquivo);

      const resposta = await fetch(
        "/api/assistente/audio",
        {
          method: "POST",
          body: formData,
        },
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            "Não foi possível processar o áudio.",
        );
      }

      const transcricao = String(
        resultado.transcricao || "",
      ).trim();

      const respostaSoraia = String(
        resultado.resposta ||
          "Áudio processado com sucesso.",
      ).trim();

      router.push(
        `/painel/assistente?audioPergunta=${encodeURIComponent(
          transcricao,
        )}&audioResposta=${encodeURIComponent(
          respostaSoraia,
        )}`,
      );
    } catch (error) {
      console.error(
        "Erro ao processar áudio:",
        error,
      );

      router.push("/painel/assistente");
    } finally {
      setProcessandoAudio(false);
    }
  }

  return (
    <div
      className={`soraia-dock ${
        collapsed
          ? "soraia-dock--collapsed"
          : ""
      }`}
    >
      <div className="soraia-dock__icon">✦</div>

      <input
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
        }}
        placeholder={
          gravando
            ? "Gravando áudio..."
            : processandoAudio
              ? "Processando áudio..."
              : "Converse com a Soraia"
        }
        disabled={gravando || processandoAudio}
      />

      <button
        type="button"
        className={`soraia-dock__microphone ${
          gravando ? "is-recording" : ""
        }`}
        aria-label={
          gravando
            ? "Finalizar gravação"
            : "Gravar áudio"
        }
        title={
          gravando
            ? "Finalizar e enviar áudio"
            : "Gravar áudio"
        }
        onClick={
          gravando
            ? finalizarGravacao
            : iniciarGravacao
        }
        disabled={processandoAudio}
      >
        {processandoAudio ? (
          <LoaderCircle
            size={18}
            className="assistant-spinner"
          />
        ) : gravando ? (
          <Square size={16} fill="currentColor" />
        ) : (
          <Mic size={18} />
        )}
      </button>

      <button
        type="button"
        className="is-primary"
        onClick={submit}
        aria-label="Enviar"
        disabled={gravando || processandoAudio}
      >
        →
      </button>
    </div>
  );
}
