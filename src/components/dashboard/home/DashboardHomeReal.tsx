import Link from "next/link";
import type { Insight } from "@/lib/soraia/insights";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowRight,
  ArrowUpCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ReceiptText,
  Sparkles,
  Wallet,
} from "lucide-react";
import "./dashboard-real.css";

type Compromisso = {
  id: string;
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number | string;
  categoria: string;
  data: string;
  recorrente: boolean;
  status: "pendente" | "pago" | "recebido";
};

type Props = {
  nome: string;
  saldoAtual: number;
  receitasMes: number;
  despesasMes: number;
  despesasFuturas: number;
  receitasFuturas: number;
  saldoPrevisto: number;
  quantidadePendentes: number;
  quantidadeVencidos: number;
  totalVencido: number;
  proximoCompromisso: Compromisso | null;
  proximosCompromissos: Compromisso[];
  insights: Insight[];
};

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}

function gerarMensagem(props: Props) {
  if (props.quantidadeVencidos > 0) {
    return `Você possui ${props.quantidadeVencidos} compromisso${
      props.quantidadeVencidos > 1 ? "s" : ""
    } vencido${
      props.quantidadeVencidos > 1 ? "s" : ""
    }, somando ${moeda(props.totalVencido)}.`;
  }

  if (props.saldoPrevisto < 0) {
    return `Seus compromissos futuros podem deixar o saldo em ${moeda(
      props.saldoPrevisto
    )}. Será necessário reforçar as receitas antes dos vencimentos.`;
  }

  if (props.despesasFuturas > 0) {
    return `Você possui ${moeda(
      props.despesasFuturas
    )} em pagamentos futuros. Após considerar entradas e saídas, o saldo previsto é ${moeda(
      props.saldoPrevisto
    )}.`;
  }

  return "Suas movimentações estão organizadas e não existem compromissos futuros pendentes.";
}

export default function DashboardHomeReal(props: Props) {
  const mensagem = gerarMensagem(props);

  return (
    <main className="real-dashboard">
      <section className="real-dashboard-hero">
        <div className="real-dashboard-hero-content">
          <span className="real-dashboard-eyebrow">
            <Sparkles size={14} />
            VISÃO FINANCEIRA
          </span>

          <h1>
            Olá, {props.nome}.
            <br />
            <strong>
              {props.saldoPrevisto >= 0
                ? "Sua vida financeira está sob controle."
                : "Precisamos preparar os próximos pagamentos."}
            </strong>
          </h1>

          <p>{mensagem}</p>

          <div className="real-dashboard-actions">
            <Link
              href="/painel/financas"
              className="real-dashboard-primary"
            >
              Ver minhas finanças
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/painel/agenda"
              className="real-dashboard-secondary"
            >
              Abrir agenda
            </Link>
          </div>
        </div>

        <div className="real-balance-orbit">
          <div className="real-balance-circle">
            <span>Saldo atual</span>
            <strong>{moeda(props.saldoAtual)}</strong>
            <small>movimentações efetivadas</small>
          </div>

          <div className="real-orbit-badge real-orbit-top">
            <span>Saldo previsto</span>
            <strong>{moeda(props.saldoPrevisto)}</strong>
          </div>

          <div className="real-orbit-badge real-orbit-bottom">
            <span>Compromissos</span>
            <strong>{props.quantidadePendentes}</strong>
          </div>
        </div>
      </section>

      <section className="real-dashboard-metrics">
        <article>
          <div className="real-metric-icon real-purple">
            <Wallet size={20} />
          </div>

          <div>
            <span>Saldo disponível</span>
            <strong>{moeda(props.saldoAtual)}</strong>
          </div>
        </article>

        <article>
          <div className="real-metric-icon real-green">
            <ArrowUpCircle size={20} />
          </div>

          <div>
            <span>Receitas do mês</span>
            <strong>{moeda(props.receitasMes)}</strong>
          </div>
        </article>

        <article>
          <div className="real-metric-icon real-red">
            <ArrowDownCircle size={20} />
          </div>

          <div>
            <span>Despesas do mês</span>
            <strong>{moeda(props.despesasMes)}</strong>
          </div>
        </article>

        <article>
          <div className="real-metric-icon real-orange">
            <CalendarClock size={20} />
          </div>

          <div>
            <span>Pagamentos futuros</span>
            <strong>{moeda(props.despesasFuturas)}</strong>
          </div>
        </article>
      </section>

      <section className="real-dashboard-grid">
        <article className="real-dashboard-card real-forecast-card">
          <div className="real-card-header">
            <div>
              <span>PREVISÃO FINANCEIRA</span>
              <h2>Depois dos próximos compromissos</h2>
            </div>

            <Clock3 size={22} />
          </div>

          <div className="real-forecast-value">
            <span>Saldo previsto</span>
            <strong
              className={
                props.saldoPrevisto < 0 ? "is-negative" : ""
              }
            >
              {moeda(props.saldoPrevisto)}
            </strong>
          </div>

          <div className="real-forecast-lines">
            <div>
              <span>Saldo atual</span>
              <strong>{moeda(props.saldoAtual)}</strong>
            </div>

            <div>
              <span>Valores a receber</span>
              <strong className="real-positive">
                +{moeda(props.receitasFuturas)}
              </strong>
            </div>

            <div>
              <span>Valores a pagar</span>
              <strong className="real-negative">
                -{moeda(props.despesasFuturas)}
              </strong>
            </div>
          </div>
        </article>

        <article className="real-dashboard-card">
          <div className="real-card-header">
            <div>
              <span>PRÓXIMO COMPROMISSO</span>
              <h2>O que vem pela frente</h2>
            </div>

            <ReceiptText size={22} />
          </div>

          {props.proximoCompromisso ? (
            <div className="real-next-commitment">
              <div
                className={`real-next-icon ${
                  props.proximoCompromisso.tipo === "receita"
                    ? "real-green"
                    : "real-red"
                }`}
              >
                {props.proximoCompromisso.tipo === "receita" ? (
                  <ArrowUpCircle size={21} />
                ) : (
                  <ArrowDownCircle size={21} />
                )}
              </div>

              <div className="real-next-content">
                <strong>
                  {props.proximoCompromisso.descricao}
                </strong>

                <span>
                  {props.proximoCompromisso.categoria} ·{" "}
                  {formatarData(props.proximoCompromisso.data)}
                </span>
              </div>

              <strong
                className={
                  props.proximoCompromisso.tipo === "receita"
                    ? "real-positive"
                    : "real-negative"
                }
              >
                {props.proximoCompromisso.tipo === "receita"
                  ? "+"
                  : "-"}
                {moeda(Number(props.proximoCompromisso.valor))}
              </strong>
            </div>
          ) : (
            <div className="real-empty-state">
              <CheckCircle2 size={28} />
              <strong>Nenhum compromisso pendente</strong>
              <span>Sua agenda financeira está livre.</span>
            </div>
          )}

          <Link
            href="/painel/agenda"
            className="real-card-link"
          >
            Ver agenda completa
            <ArrowRight size={15} />
          </Link>
        </article>

        <article className="real-dashboard-card real-insight-card">
          <div className="real-card-header">
            <div>
              <span>BRIEFING DA SORAIA</span>
              <h2>Análise rápida</h2>
            </div>

            <Sparkles size={22} />
          </div>

          <div className="real-insight-list">
            {props.insights.length > 0 ? (
              props.insights.map((insight) => (
                <div
                  className={`real-insight real-insight-${insight.tipo}`}
                  key={insight.id}
                >
                  {insight.tipo === "alerta" ? (
                    <AlertTriangle size={22} />
                  ) : (
                    <Sparkles size={22} />
                  )}

                  <div>
                    <strong>{insight.titulo}</strong>
                    <p>{insight.mensagem}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="real-insight">
                <Sparkles size={22} />

                <div>
                  <strong>Análise financeira</strong>
                  <p>{mensagem}</p>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/painel/assistente"
            className="real-card-link"
          >
            Conversar com a Soraia
            <ArrowRight size={15} />
          </Link>
        </article>

        <article className="real-dashboard-card">
          <div className="real-card-header">
            <div>
              <span>PRÓXIMOS EVENTOS</span>
              <h2>Agenda resumida</h2>
            </div>

            <CalendarClock size={22} />
          </div>

          {props.proximosCompromissos.length > 0 ? (
            <div className="real-commitment-list">
              {props.proximosCompromissos.map((item) => (
                <div className="real-commitment-row" key={item.id}>
                  <div>
                    <strong>{item.descricao}</strong>
                    <span>{formatarData(item.data)}</span>
                  </div>

                  <strong
                    className={
                      item.tipo === "receita"
                        ? "real-positive"
                        : "real-negative"
                    }
                  >
                    {item.tipo === "receita" ? "+" : "-"}
                    {moeda(Number(item.valor))}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="real-empty-state">
              <CheckCircle2 size={28} />
              <strong>Nada programado</strong>
              <span>Cadastre uma movimentação futura.</span>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
