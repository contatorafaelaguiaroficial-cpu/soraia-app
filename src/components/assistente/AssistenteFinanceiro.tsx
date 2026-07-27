"use client";

import {
  ArrowUp,
  Bot,
  LoaderCircle,
  Send,
  Sparkles,
  UserRound,
  WalletCards,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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

export default function AssistenteFinanceiro() {
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
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensagens, carregando]);

  async function enviarMensagem(mensagemManual?: string) {
    const pergunta = (mensagemManual ?? texto).trim();

    if (!pergunta || carregando) return;

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
            "Não foi possível obter uma resposta."
        );
      }

      setMensagens((atual) => [
        ...atual,
        {
          id: criarId(),
          role: "assistant",
          content: resultado.resposta,
        },
      ]);
    } catch (error) {
      setMensagens((atual) => [
        ...atual,
        {
          id: criarId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Não consegui responder agora. Tente novamente.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    enviarMensagem();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
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
                disabled={carregando}
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
              <span>Assistente financeira pessoal</span>
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

            {carregando && (
              <article className="assistant-message is-assistant">
                <div className="assistant-message-avatar">
                  <Bot size={18} />
                </div>

                <div className="assistant-message-content">
                  <span>Soraia</span>

                  <div className="assistant-thinking">
                    <LoaderCircle size={16} />
                    Analisando suas finanças...
                  </div>
                </div>
              </article>
            )}

            <div ref={fimRef} />
          </div>

          <form
            className="assistant-composer"
            onSubmit={handleSubmit}
          >
            <textarea
              value={texto}
              onChange={(event) =>
                setTexto(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre seu saldo, contas ou uma possível compra..."
              rows={1}
              maxLength={2_000}
              disabled={carregando}
            />

            <button
              type="submit"
              disabled={
                carregando || !texto.trim()
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
          </form>
        </section>
      </section>
    </main>
  );
}
