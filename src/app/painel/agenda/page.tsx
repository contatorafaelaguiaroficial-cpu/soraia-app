import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ReceiptText,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  efetivarMovimentacao,
  excluirMovimentacao,
} from "../financas/actions";
import "./agenda.css";

type Movimentacao = {
  id: string;
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number | string;
  categoria: string;
  data: string;
  recorrente: boolean;
  status: "pendente" | "pago" | "recebido";
};

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function obterHojeBrasil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatarDataCompleta(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}

function formatarDataCurta(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}

function adicionarDias(data: string, dias: number) {
  const date = new Date(`${data}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + dias);
  return date.toISOString().split("T")[0];
}

function tituloDoGrupo(data: string, hoje: string) {
  const amanha = adicionarDias(hoje, 1);

  if (data < hoje) {
    return "Vencidos";
  }

  if (data === hoje) {
    return "Hoje";
  }

  if (data === amanha) {
    return "Amanhã";
  }

  return formatarDataCompleta(data);
}

export default async function AgendaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hoje = obterHojeBrasil();

  const { data, error } = user
    ? await supabase
        .from("transactions")
        .select(
          "id, tipo, descricao, valor, categoria, data, recorrente, status"
        )
        .eq("user_id", user.id)
        .eq("status", "pendente")
        .order("data", { ascending: true })
        .limit(200)
    : { data: [], error: null };

  if (error) {
    console.error("Erro ao carregar agenda:", error);
  }

  const movimentacoes = (data || []) as Movimentacao[];

  const despesasPendentes = movimentacoes
    .filter((item) => item.tipo === "despesa")
    .reduce((total, item) => total + Number(item.valor), 0);

  const receitasPendentes = movimentacoes
    .filter((item) => item.tipo === "receita")
    .reduce((total, item) => total + Number(item.valor), 0);

  const vencidas = movimentacoes.filter(
    (item) => item.data < hoje
  ).length;

  const hojeQuantidade = movimentacoes.filter(
    (item) => item.data === hoje
  ).length;

  const grupos = movimentacoes.reduce<Record<string, Movimentacao[]>>(
    (acumulador, item) => {
      if (!acumulador[item.data]) {
        acumulador[item.data] = [];
      }

      acumulador[item.data].push(item);

      return acumulador;
    },
    {}
  );

  const datasOrdenadas = Object.keys(grupos).sort();

  return (
    <main className="agenda-page">
      <header className="agenda-header">
        <div>
          <span className="agenda-eyebrow">AGENDA FINANCEIRA</span>

          <h1>Próximos compromissos</h1>

          <p>
            Acompanhe contas a pagar e valores a receber sem alterar o
            saldo atual antes da confirmação.
          </p>
        </div>
      </header>

      <section className="agenda-summary">
        <article className="agenda-summary-card">
          <div className="agenda-summary-icon agenda-purple">
            <CalendarClock size={20} />
          </div>

          <div>
            <span>Compromissos</span>
            <strong>{movimentacoes.length}</strong>
          </div>
        </article>

        <article className="agenda-summary-card">
          <div className="agenda-summary-icon agenda-expense">
            <ArrowDownCircle size={20} />
          </div>

          <div>
            <span>A pagar</span>
            <strong>{moeda(despesasPendentes)}</strong>
          </div>
        </article>

        <article className="agenda-summary-card">
          <div className="agenda-summary-icon agenda-income">
            <ArrowUpCircle size={20} />
          </div>

          <div>
            <span>A receber</span>
            <strong>{moeda(receitasPendentes)}</strong>
          </div>
        </article>

        <article className="agenda-summary-card">
          <div className="agenda-summary-icon agenda-warning">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>Vencidos</span>
            <strong>{vencidas}</strong>
          </div>
        </article>

        <article className="agenda-summary-card">
          <div className="agenda-summary-icon agenda-today">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Para hoje</span>
            <strong>{hojeQuantidade}</strong>
          </div>
        </article>
      </section>

      <section className="agenda-card">
        <div className="agenda-card-header">
          <div>
            <span>CRONOGRAMA</span>
            <h2>Contas e recebimentos</h2>
          </div>

          <ReceiptText size={22} />
        </div>

        {movimentacoes.length === 0 ? (
          <div className="agenda-empty">
            <CalendarClock size={34} />

            <h3>Nenhum compromisso pendente</h3>

            <p>
              As movimentações futuras cadastradas em Finanças
              aparecerão automaticamente aqui.
            </p>
          </div>
        ) : (
          <div className="agenda-timeline">
            {datasOrdenadas.map((dataGrupo) => {
              const itens = grupos[dataGrupo];
              const grupoVencido = dataGrupo < hoje;
              const grupoHoje = dataGrupo === hoje;

              return (
                <section
                  className="agenda-group"
                  key={dataGrupo}
                >
                  <div className="agenda-group-date">
                    <span
                      className={`agenda-date-marker ${
                        grupoVencido
                          ? "is-overdue"
                          : grupoHoje
                            ? "is-today"
                            : ""
                      }`}
                    />

                    <div>
                      <strong>
                        {tituloDoGrupo(dataGrupo, hoje)}
                      </strong>

                      <span>{formatarDataCurta(dataGrupo)}</span>
                    </div>
                  </div>

                  <div className="agenda-group-items">
                    {itens.map((item) => {
                      const vencido = item.data < hoje;

                      return (
                        <article
                          className={`agenda-item ${
                            vencido ? "agenda-item-overdue" : ""
                          }`}
                          key={item.id}
                        >
                          <div
                            className={`agenda-item-icon ${
                              item.tipo === "receita"
                                ? "agenda-income"
                                : "agenda-expense"
                            }`}
                          >
                            {item.tipo === "receita" ? (
                              <ArrowUpCircle size={19} />
                            ) : (
                              <ArrowDownCircle size={19} />
                            )}
                          </div>

                          <div className="agenda-item-content">
                            <div className="agenda-item-title">
                              <strong>{item.descricao}</strong>

                              <span
                                className={`agenda-badge ${
                                  vencido
                                    ? "agenda-badge-overdue"
                                    : "agenda-badge-pending"
                                }`}
                              >
                                {vencido
                                  ? "Vencido"
                                  : item.tipo === "receita"
                                    ? "A receber"
                                    : "A pagar"}
                              </span>
                            </div>

                            <span>
                              {item.categoria}
                              {item.recorrente
                                ? " · Recorrente"
                                : ""}
                            </span>
                          </div>

                          <strong
                            className={
                              item.tipo === "receita"
                                ? "agenda-value-income"
                                : "agenda-value-expense"
                            }
                          >
                            {item.tipo === "receita" ? "+" : "-"}
                            {moeda(Number(item.valor))}
                          </strong>

                          <form action={efetivarMovimentacao}>
                            <input
                              type="hidden"
                              name="id"
                              value={item.id}
                            />

                            <input
                              type="hidden"
                              name="tipo"
                              value={item.tipo}
                            />

                            <button
                              type="submit"
                              className="agenda-confirm"
                              title={
                                item.tipo === "receita"
                                  ? "Marcar como recebido"
                                  : "Marcar como pago"
                              }
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          </form>

                          <form action={excluirMovimentacao}>
                            <input
                              type="hidden"
                              name="id"
                              value={item.id}
                            />

                            <button
                              type="submit"
                              className="agenda-delete"
                              title="Excluir movimentação"
                            >
                              <Trash2 size={17} />
                            </button>
                          </form>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
