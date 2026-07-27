import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  PiggyBank,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import NovaMetaForm from "@/components/NovaMetaForm";
import { createClient } from "@/lib/supabase/server";
import "./metas.css";

type Meta = {
  id: string;
  nome: string;
  valor_atual: number | string;
  valor_meta: number | string;
  created_at?: string;
  prazo: string | null;
};

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function limitarPercentual(valor: number) {
  return Math.min(Math.max(valor, 0), 100);
}

export default async function MetasPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = user
    ? await supabase
        .from("metas")
        .select(
          "id, nome, valor_atual, valor_meta, created_at, prazo",
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
    : { data: [], error: null };

  if (error) {
    console.error("Erro ao carregar metas:", error);
  }

  const metas = (data ?? []) as Meta[];

  const totalPlanejado = metas.reduce(
    (total, meta) =>
      total + Number(meta.valor_meta),
    0,
  );

  const totalGuardado = metas.reduce(
    (total, meta) =>
      total + Number(meta.valor_atual),
    0,
  );

  const metasConcluidas = metas.filter(
    (meta) =>
      Number(meta.valor_atual) >=
      Number(meta.valor_meta),
  ).length;

  const progressoGeral =
    totalPlanejado > 0
      ? limitarPercentual(
          Math.round(
            (totalGuardado / totalPlanejado) * 100,
          ),
        )
      : 0;

  return (
    <main className="goals-page">
      <header className="goals-header">
        <div>
          <span className="goals-eyebrow">
            <Sparkles size={14} />
            PLANEJAMENTO FINANCEIRO
          </span>

          <h1>Suas metas financeiras</h1>

          <p>
            Transforme seus planos em objetivos claros e
            acompanhe cada avanço.
          </p>
        </div>

        <div className="goals-header-badge">
          <Target size={20} />
          <div>
            <strong>{metas.length}</strong>
            <span>
              {metas.length === 1
                ? "meta cadastrada"
                : "metas cadastradas"}
            </span>
          </div>
        </div>
      </header>

      <section className="goals-summary">
        <article>
          <div className="goals-summary-icon">
            <PiggyBank size={21} />
          </div>

          <div>
            <span>Total guardado</span>
            <strong>{moeda(totalGuardado)}</strong>
          </div>
        </article>

        <article>
          <div className="goals-summary-icon">
            <Target size={21} />
          </div>

          <div>
            <span>Total planejado</span>
            <strong>{moeda(totalPlanejado)}</strong>
          </div>
        </article>

        <article>
          <div className="goals-summary-icon">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Progresso geral</span>
            <strong>{progressoGeral}%</strong>
          </div>
        </article>

        <article>
          <div className="goals-summary-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Metas concluídas</span>
            <strong>{metasConcluidas}</strong>
          </div>
        </article>
      </section>

      <section className="goals-content">
        <div className="goals-section-heading">
          <div>
            <span>OBJETIVOS</span>
            <h2>Acompanhe seu progresso</h2>
          </div>
        </div>

        {metas.length === 0 ? (
          <div className="goals-empty">
            <div className="goals-empty-icon">
              <Target size={30} />
            </div>

            <h2>Crie sua primeira meta</h2>

            <p>
              Defina um objetivo, informe o valor que deseja
              alcançar e acompanhe seus aportes.
            </p>
          </div>
        ) : (
          <div className="goals-grid">
            {metas.map((meta) => {
              const valorAtual = Number(meta.valor_atual);
              const valorMeta = Number(meta.valor_meta);

              const percentual =
                valorMeta > 0
                  ? limitarPercentual(
                      Math.round(
                        (valorAtual / valorMeta) * 100,
                      ),
                    )
                  : 0;

              const concluida =
                valorAtual >= valorMeta &&
                valorMeta > 0;

              return (
                <Link
                  href={`/painel/metas/${meta.id}`}
                  className="goal-card"
                  key={meta.id}
                >
                  <div className="goal-card-top">
                    <div className="goal-card-icon">
                      {concluida ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Target size={20} />
                      )}
                    </div>

                    <span
                      className={
                        concluida
                          ? "goal-status is-complete"
                          : "goal-status"
                      }
                    >
                      {concluida
                        ? "Concluída"
                        : `${percentual}% concluída`}
                    </span>
                  </div>

                  <div className="goal-card-content">
                    <h3>{meta.nome}</h3>

                    {meta.prazo && (
                      <span
                        style={{
                          display: "block",
                          marginBottom: 12,
                          color: "#918A9B",
                          fontSize: 12,
                        }}
                      >
                        Prazo:{" "}
                        {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        }).format(
                          new Date(`${meta.prazo}T00:00:00Z`),
                        )}
                      </span>
                    )}

                    <div className="goal-values">
                      <strong>
                        {moeda(valorAtual)}
                      </strong>

                      <span>
                        de {moeda(valorMeta)}
                      </span>
                    </div>

                    <div className="goal-progress">
                      <span
                        style={{
                          width: `${percentual}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="goal-card-footer">
                    <span>
                      {concluida
                        ? "Objetivo alcançado"
                        : `Faltam ${moeda(
                            Math.max(
                              valorMeta - valorAtual,
                              0,
                            ),
                          )}`}
                    </span>

                    <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="goals-new-form">
          <NovaMetaForm />
        </div>
      </section>
    </main>
  );
}
