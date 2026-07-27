"use client";

import {
  ArrowUp,
  Bot,
  LoaderCircle,
  Mic,
  Send,
  Sparkles,
  Square,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

type Mensagem = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const perguntasRapidas = [
  "Quanto tenho disponível hoje?",
  "Quais são meus próximos compromissos?",
  "Como ficará meu saldo depois das contas?",
  "Posso gastar R$ 500,00 hoje?",
];

function criarId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function formatarTempo(segundos: number) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${String(minutos).padStart(2, "0")}:${String(
    segundosRestantes,
  ).padStart(2, "0")}`;
}

export default function AssistenteFinanceiro() {
  const searchParams = useSearchParams();
  const mensagemInicialEnviadaRef = useRef(false);

  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: "boas-vindas",
      role: "assistant",
      content:
        "Olá! Eu sou a Soraia. Posso analisar seu saldo, compromissos futuros e movimentações para ajudar você a tomar decisões financeiras mais conscientes.",
    },
  ]);

  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [processandoAudio, setProcessandoAudio] =
    useState(false);
  const [tempoGravacao, setTempoGravacao] = useState(0);

  const fimRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cancelarAudioRef = useRef(false);

  useEffect(() => {
    fimRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensagens, carregando, processandoAudio]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  function adicionarErro(mensagem: string) {
    setMensagens((atual) => [
      ...atual,
      {
        id: criarId(),
        role: "assistant",
        content: mensagem,
      },
    ]);
  }

  async function enviarMensagem(mensagemManual?: string) {
    const pergunta = (mensagemManual ?? texto).trim();

    if (
      !pergunta ||
      carregando ||
      gravando ||
      processandoAudio
    ) {
      return;
    }

    const mensagemUsuario: Mensagem = {
      id: criarId(),
      role: "user",
      content: pergunta,
    };

    const historicoAnterior = mensagens
      .filter((item) => item.id !== "boas-vindas")
      .slice(-8)
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));

    setMensagens((atual) => [
      ...atual,
      mensagemUsuario,
    ]);

    setTexto("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/assistente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensagem: pergunta,
          historico: historicoAnterior,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            resultado.error ||
            "Não foi possível obter uma resposta.",
        );
      }

      setMensagens((atual) => [
        ...atual,
        {
          id: criarId(),
          role: "assistant",
          content:
            resultado.resposta ||
            "Não consegui elaborar uma resposta.",
        },
      ]);
    } catch (error) {
      adicionarErro(
        error instanceof Error
          ? error.message
          : "Não consegui responder agora. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (mensagemInicialEnviadaRef.current) {
      return;
    }

    const mensagemInicial =
      searchParams.get("mensagem")?.trim() || "";

    const audioPergunta =
      searchParams.get("audioPergunta")?.trim() || "";

    const audioResposta =
      searchParams.get("audioResposta")?.trim() || "";

    if (audioPergunta && audioResposta) {
      mensagemInicialEnviadaRef.current = true;

      setMensagens((atual) => [
        ...atual,
        {
          id: criarId(),
          role: "user",
          content: `🎤 ${audioPergunta}`,
        },
        {
          id: criarId(),
          role: "assistant",
          content: audioResposta,
        },
      ]);

      window.history.replaceState(
        {},
        "",
        "/painel/assistente",
      );

      return;
    }

    if (!mensagemInicial) {
      return;
    }

    mensagemInicialEnviadaRef.current = true;

    window.history.replaceState(
      {},
      "",
      "/painel/assistente",
    );

    void enviarMensagem(mensagemInicial);
  }, [searchParams]);

  async function iniciarGravacao() {
    if (
      carregando ||
      processandoAudio ||
      gravando
    ) {
      return;
    }

    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        adicionarErro(
          "Este navegador não permite gravar áudio.",
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;
      audioChunksRef.current = [];
      cancelarAudioRef.current = false;
      setTempoGravacao(0);

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
        ? new MediaRecorder(stream, {
            mimeType,
          })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = gravador;

      gravador.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      gravador.onerror = () => {
        adicionarErro(
          "Ocorreu um erro durante a gravação do áudio.",
        );

        pararTracks();
        limparTimer();
        setGravando(false);
      };

      gravador.onstop = async () => {
        pararTracks();
        limparTimer();
        setGravando(false);

        if (cancelarAudioRef.current) {
          audioChunksRef.current = [];
          setTempoGravacao(0);
          return;
        }

        if (audioChunksRef.current.length === 0) {
          adicionarErro(
            "Não consegui capturar o áudio. Tente novamente.",
          );
          return;
        }

        const tipoDoAudio =
          gravador.mimeType || "audio/webm";

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: tipoDoAudio,
          },
        );

        audioChunksRef.current = [];

        await enviarAudio(audioBlob);
      };

      gravador.start(250);
      setGravando(true);

      timerRef.current = setInterval(() => {
        setTempoGravacao((tempo) => tempo + 1);
      }, 1000);
    } catch (error) {
      console.error(
        "Erro ao acessar o microfone:",
        error,
      );

      adicionarErro(
        "Não foi possível acessar o microfone. Verifique se a permissão foi autorizada no navegador.",
      );

      pararTracks();
      limparTimer();
      setGravando(false);
    }
  }

  function finalizarGravacao() {
    const gravador = mediaRecorderRef.current;

    if (
      gravador &&
      gravador.state === "recording"
    ) {
      cancelarAudioRef.current = false;
      gravador.stop();
    }
  }

  function cancelarGravacao() {
    cancelarAudioRef.current = true;

    const gravador = mediaRecorderRef.current;

    if (
      gravador &&
      gravador.state === "recording"
    ) {
      gravador.stop();
    } else {
      pararTracks();
      limparTimer();
      setGravando(false);
      setTempoGravacao(0);
    }
  }

  function pararTracks() {
    streamRef.current
      ?.getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;
  }

  function limparTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function enviarAudio(audioBlob: Blob) {
    setProcessandoAudio(true);

    try {
      const extensao = audioBlob.type.includes("mp4")
        ? "mp4"
        : "webm";

      const arquivo = new File(
        [audioBlob],
        `audio-soraia-${Date.now()}.${extensao}`,
        {
          type: audioBlob.type,
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
            resultado.error ||
            resultado.resposta ||
            "Não foi possível processar o áudio.",
        );
      }

      const transcricao = String(
        resultado.transcricao ||
          resultado.texto ||
          "",
      ).trim();

      const respostaSoraia = String(
        resultado.resposta ||
          "Áudio processado com sucesso.",
      ).trim();

      if (transcricao) {
        setMensagens((atual) => [
          ...atual,
          {
            id: criarId(),
            role: "user",
            content: `🎤 ${transcricao}`,
          },
        ]);
      }

      setMensagens((atual) => [
        ...atual,
        {
          id: criarId(),
          role: "assistant",
          content: respostaSoraia,
        },
      ]);
    } catch (error) {
      console.error(
        "Erro ao enviar áudio:",
        error,
      );

      adicionarErro(
        error instanceof Error
          ? error.message
          : "Não consegui processar seu áudio. Tente novamente.",
      );
    } finally {
      setProcessandoAudio(false);
      setTempoGravacao(0);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    enviarMensagem();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      enviarMensagem();
    }
  }

  return (
    <main className="assistant-page">
      <header className="assistant-header">
        <div>
          <span className="assistant-eyebrow">
            <Sparkles size={14} />
            ASSISTENTE FINANCEIRA
          </span>

          <h1>Converse com a Soraia</h1>

          <p>
            Faça perguntas usando seus dados financeiros reais.
          </p>
        </div>

        <div className="assistant-status">
          <span />
          Dados conectados
        </div>
      </header>

      <section className="assistant-layout">
        <aside className="assistant-side">
          <div className="assistant-side-icon">
            <WalletCards size={23} />
          </div>

          <span>PERGUNTAS SUGERIDAS</span>

          <h2>Por onde começar?</h2>

          <p>
            A Soraia analisa saldo atual, valores futuros e
            compromissos pendentes.
          </p>

          <div className="assistant-suggestions">
            {perguntasRapidas.map((pergunta) => (
              <button
                type="button"
                key={pergunta}
                onClick={() =>
                  enviarMensagem(pergunta)
                }
                disabled={
                  carregando ||
                  gravando ||
                  processandoAudio
                }
              >
                {pergunta}
                <ArrowUp size={15} />
              </button>
            ))}
          </div>

          <div className="assistant-notice">
            As respostas são análises auxiliares e não substituem
            orientação profissional.
          </div>
        </aside>

        <section className="assistant-chat">
          <div className="assistant-chat-header">
            <div className="assistant-bot-avatar">
              <Sparkles size={20} />
            </div>

            <div>
              <strong>Soraia</strong>
              <span>
                Assistente financeira pessoal
              </span>
            </div>
          </div>

          <div className="assistant-messages">
            {mensagens.map((mensagem) => (
              <article
                key={mensagem.id}
                className={`assistant-message ${
                  mensagem.role === "user"
                    ? "is-user"
                    : "is-assistant"
                }`}
              >
                <div className="assistant-message-avatar">
                  {mensagem.role === "user" ? (
                    <UserRound size={17} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>

                <div className="assistant-message-content">
                  <span>
                    {mensagem.role === "user"
                      ? "Você"
                      : "Soraia"}
                  </span>

                  <p>{mensagem.content}</p>
                </div>
              </article>
            ))}

            {(carregando || processandoAudio) && (
              <article className="assistant-message is-assistant">
                <div className="assistant-message-avatar">
                  <Bot size={18} />
                </div>

                <div className="assistant-message-content">
                  <span>Soraia</span>

                  <div className="assistant-thinking">
                    <LoaderCircle size={16} />

                    {processandoAudio
                      ? "Ouvindo e analisando seu áudio..."
                      : "Analisando suas finanças..."}
                  </div>
                </div>
              </article>
            )}

            <div ref={fimRef} />
          </div>

          <form
            className={`assistant-composer ${
              gravando ? "is-recording" : ""
            }`}
            onSubmit={handleSubmit}
          >
            {gravando ? (
              <div className="assistant-recording">
                <button
                  type="button"
                  className="assistant-recording-cancel"
                  onClick={cancelarGravacao}
                  title="Cancelar gravação"
                >
                  <X size={19} />
                </button>

                <div className="assistant-recording-info">
                  <span className="assistant-recording-dot" />

                  <div>
                    <strong>Gravando áudio</strong>
                    <small>
                      {formatarTempo(tempoGravacao)}
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  className="assistant-recording-finish"
                  onClick={finalizarGravacao}
                  title="Finalizar e enviar áudio"
                >
                  <Square size={17} fill="currentColor" />
                </button>
              </div>
            ) : (
              <>
                <textarea
                  value={texto}
                  onChange={(event) =>
                    setTexto(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte sobre seu saldo, contas ou uma possível compra..."
                  rows={1}
                  maxLength={2_000}
                  disabled={
                    carregando || processandoAudio
                  }
                />

                <div className="assistant-composer-actions">
                  <button
                    type="button"
                    className="assistant-microphone"
                    onClick={iniciarGravacao}
                    disabled={
                      carregando || processandoAudio
                    }
                    title="Gravar áudio"
                  >
                    {processandoAudio ? (
                      <LoaderCircle
                        size={19}
                        className="assistant-spinner"
                      />
                    ) : (
                      <Mic size={19} />
                    )}
                  </button>

                  <button
                    type="submit"
                    className="assistant-send"
                    disabled={
                      carregando ||
                      processandoAudio ||
                      !texto.trim()
                    }
                    title="Enviar mensagem"
                  >
                    {carregando ? (
                      <LoaderCircle
                        size={19}
                        className="assistant-spinner"
                      />
                    ) : (
                      <Send size={19} />
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </section>
      </section>
    </main>
  );
}
