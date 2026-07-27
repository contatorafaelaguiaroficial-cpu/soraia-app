import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ReceiptText,
  Trash2,
  Wallet,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import NovaMovimentacaoForm from "@/components/financas/NovaMovimentacaoForm";
import {
  efetivarMovimentacao,
  excluirMovimentacao,
} from "./actions";
import "./financas.css";

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

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${data}T00:00:00Z`));
}

function obterHojeBrasil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function FinancasPage() {
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
        .order("data", { ascending: false })
        .limit(100)
    : { data: [], error: null };

  if (error) {
    console.error("Erro ao carregar movimentações:", error);
  }

  const movimentacoes = (data || []) as Movimentacao[];

  const movimentacoesEfetivadas = movimentacoes.filter(
    (item) =>
      item.data <= hoje &&
      (item.status === "pago" || item.status === "recebido")
  );

  const receitas = movimentacoesEfetivadas
    .filter((item) => item.tipo === "receita")
    .reduce((total, item) => total + Number(item.valor), 0);

  const despesas = movimentacoesEfetivadas
    .filter((item) => item.tipo === "despesa")
    .reduce((total, item) => total + Number(item.valor), 0);

  const saldo = receitas - despesas;

  const compromissosFuturos = movimentacoes
    .filter(
      (item) =>
        item.tipo === "despesa" &&
        item.status === "pendente" &&
        item.data > hoje
    )
    .reduce((total, item) => total + Number(item.valor), 0);

  const saldoPrevisto = saldo - compromissosFuturos;

  return (
    <main className="finance-page">
      <header className="finance-page-header">
        <div>
          <span className="finance-eyebrow">CONTROLE FINANCEIRO</span>

          <h1>Suas finanças</h1>

          <p>
            Movimentações futuras ficam agendadas e só alteram o saldo
            depois de serem efetivadas.
          </p>
        </div>
      </header>

      <section className="finance-summary">
        <article className="finance-summary-card">
          <div className="finance-summary-icon">
            <Wallet size={20} />
          </div>

          <div>
            <span>Saldo atual</span>
            <strong>{moeda(saldo)}</strong>
          </div>
        </article>

        <article className="finance-summary-card">
          <div className="finance-summary-icon finance-income">
            <ArrowUpCircle size={20} />
          </div>

          <div>
            <span>Receitas recebidas</span>
            <strong>{moeda(receitas)}</strong>
          </div>
        </article>

        <article className="finance-summary-card">
          <div className="finance-summary-icon finance-expense">
            <ArrowDownCircle size={20} />
          </div>

          <div>
            <span>Despesas pagas</span>
            <strong>{moeda(despesas)}</strong>
          </div>
        </article>

        <article className="finance-summary-card">
          <div className="finance-summary-icon finance-pending">
            <CalendarClock size={20} />
          </div>

          <div>
            <span>Compromissos futuros</span>
            <strong>{moeda(compromissosFuturos)}</strong>
          </div>
        </article>

        <article className="finance-summary-card">
          <div className="finance-summary-icon finance-forecast">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Saldo previsto</span>
            <strong>{moeda(saldoPrevisto)}</strong>
          </div>
        </article>
      </section>

      <section className="finance-layout">
        <NovaMovimentacaoForm />

        <div className="finance-list-card">
          <div className="finance-list-header">
            <div>
              <span>MOVIMENTAÇÕES</span>
              <h2>Histórico e compromissos</h2>
            </div>

            <ReceiptText size={21} />
          </div>

          {movimentacoes.length === 0 ? (
            <div className="finance-empty">
              <ReceiptText size={30} />

              <h3>Nenhuma movimentação ainda</h3>

              <p>
                Registre sua primeira receita ou despesa no formulário.
              </p>
            </div>
          ) : (
            <div className="finance-list">
              {movimentacoes.map((item) => {
                const pendente = item.status === "pendente";
                const futura = item.data > hoje;

                return (
                  <article
                    className={`finance-transaction ${
                      pendente ? "finance-transaction-pending" : ""
                    }`}
                    key={item.id}
                  >
                    <div
                      className={`finance-transaction-icon ${
                        item.tipo === "receita"
                          ? "finance-income"
                          : "finance-expense"
                      }`}
                    >
                      {item.tipo === "receita" ? (
                        <ArrowUpCircle size={18} />
                      ) : (
                        <ArrowDownCircle size={18} />
                      )}
                    </div>

                    <div className="finance-transaction-content">
                      <div className="finance-transaction-title">
                        <strong>{item.descricao}</strong>

                        <span
                          className={`finance-status ${
                            pendente
                              ? "finance-status-pending"
                              : "finance-status-done"
                          }`}
                        >
                          {pendente
                            ? futura
                              ? "Agendado"
                              : "Pendente"
                            : item.tipo === "receita"
                              ? "Recebido"
                              : "Pago"}
                        </span>
                      </div>

                      <span>
                        {item.categoria} · {formatarData(item.data)}
                        {item.recorrente ? " · Recorrente" : ""}
                      </span>
                    </div>

                    <strong
                      className={
                        pendente
                          ? "finance-value-pending"
                          : item.tipo === "receita"
                            ? "finance-value-income"
                            : "finance-value-expense"
                      }
                    >
                      {item.tipo === "receita" ? "+" : "-"}
                      {moeda(Number(item.valor))}
                    </strong>

                    {pendente && (
                      <form action={efetivarMovimentacao}>
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          type="hidden"
                          name="tipo"
                          value={item.tipo}
                        />

                        <button
                          type="submit"
                          className="finance-confirm"
                          title={
                            item.tipo === "receita"
                              ? "Marcar como recebido"
                              : "Marcar como pago"
                          }
                        >
                          <CheckCircle2 size={17} />
                        </button>
                      </form>
                    )}

                    <form action={excluirMovimentacao}>
                      <input type="hidden" name="id" value={item.id} />

                      <button
                        type="submit"
                        className="finance-delete"
                        title="Excluir movimentação"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
