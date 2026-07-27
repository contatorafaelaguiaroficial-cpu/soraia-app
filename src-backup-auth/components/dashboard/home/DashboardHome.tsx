"use client";

import "./redesign.css";
import { useState } from "react";

const commitments = [
  { date: "28 JUL", title: "Aluguel", detail: "Conta principal", amount: "R$ 1.800,00" },
  { date: "30 JUL", title: "Internet", detail: "Débito automático", amount: "R$ 139,00" },
  { date: "02 AGO", title: "Aporte mensal", detail: "Reserva de emergência", amount: "R$ 750,00" },
];

const goals = [
  { title: "Reserva de emergência", percent: 78, current: "R$ 23.400,00", target: "R$ 30.000,00" },
  { title: "Viagem em família", percent: 54, current: "R$ 8.100,00", target: "R$ 15.000,00" },
  { title: "Novo apartamento", percent: 31, current: "R$ 18.600,00", target: "R$ 60.000,00" },
];

export default function DashboardHome() {
  const [message, setMessage] = useState("");

  return (
    <>
      <header className="soraia-topbar">
        <div>
          <span>Segunda-feira, 27 de julho</span>
          <h1>Bom dia, Rafael.</h1>
        </div>

        <div className="soraia-topbar__actions">
          <button aria-label="Pesquisar">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button aria-label="Notificações">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 9a6 6 0 0 1 12 0v5l2 2H4l2-2V9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M10 19h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="soraia-home soraia-home--editorial">
        <section className="soraia-editorial-hero">
          <div className="soraia-editorial-hero__copy">
            <div className="soraia-editorial-hero__eyebrow">
              <span />
              Leitura financeira de hoje
            </div>

            <h2>
              Você está em um mês
              <em> mais leve do que parece.</em>
            </h2>

            <p>
              Mesmo com três compromissos próximos, sua reserva continua saudável e seu ritmo de gastos melhorou.
              A Soraia recomenda manter o plano atual e antecipar R$ 250,00 para sua principal meta.
            </p>

            <div className="soraia-editorial-hero__actions">
              <button className="is-primary">Ver análise completa</button>
              <button>Revisar meu mês</button>
            </div>
          </div>

          <div className="soraia-orbit">
            <div className="soraia-orbit__ring soraia-orbit__ring--one" />
            <div className="soraia-orbit__ring soraia-orbit__ring--two" />
            <div className="soraia-orbit__core">
              <span>Saldo livre</span>
              <strong>R$ 8.450</strong>
              <small>após compromissos</small>
            </div>
            <div className="soraia-orbit__tag soraia-orbit__tag--top">
              <span>↑ 4,2%</span>
              patrimônio
            </div>
            <div className="soraia-orbit__tag soraia-orbit__tag--bottom">
              <span>12% menor</span>
              ritmo de gastos
            </div>
          </div>
        </section>

        <section className="soraia-editorial-grid">
          <article className="soraia-wealth">
            <div className="soraia-wealth__header">
              <div>
                <span>Patrimônio consolidado</span>
                <h3>R$ 154.320,00</h3>
              </div>
              <div className="soraia-wealth__delta">↑ 4,2% no mês</div>
            </div>

            <div className="soraia-wealth__chart">
              <svg viewBox="0 0 760 230" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wealthStroke" x1="0" x2="1">
                    <stop offset="0%" stopColor="#7256d9" />
                    <stop offset="100%" stopColor="#c8b7ff" />
                  </linearGradient>
                  <linearGradient id="wealthArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9b7cff" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#9b7cff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="area" d="M0 188 C60 176,80 161,125 164 C175 167,205 125,255 131 C318 139,342 90,408 98 C474 105,514 60,575 70 C636 80,680 38,760 28 L760 230 L0 230 Z" />
                <path className="line" d="M0 188 C60 176,80 161,125 164 C175 167,205 125,255 131 C318 139,342 90,408 98 C474 105,514 60,575 70 C636 80,680 38,760 28" />
                <circle cx="760" cy="28" r="5" />
              </svg>
            </div>

            <div className="soraia-wealth__legend">
              <div>
                <span>Disponível</span>
                <strong>R$ 8.450,00</strong>
              </div>
              <div>
                <span>Investido</span>
                <strong>R$ 97.680,00</strong>
              </div>
              <div>
                <span>Metas</span>
                <strong>R$ 48.190,00</strong>
              </div>
            </div>
          </article>

          <aside className="soraia-briefing">
            <div className="soraia-briefing__header">
              <span>Briefing da Soraia</span>
              <button>•••</button>
            </div>

            <div className="soraia-briefing__quote">
              “Seu caixa permite acelerar uma meta sem comprometer as contas da próxima semana.”
            </div>

            <div className="soraia-briefing__items">
              <div>
                <span className="is-good">Positivo</span>
                <strong>Gastos 12% abaixo da média</strong>
              </div>
              <div>
                <span className="is-warning">Atenção</span>
                <strong>R$ 1.939,00 vencem até quarta</strong>
              </div>
              <div>
                <span className="is-neutral">Oportunidade</span>
                <strong>Antecipar R$ 250,00 para uma meta</strong>
              </div>
            </div>
          </aside>
        </section>

        <section className="soraia-flow">
          <div className="soraia-flow__heading">
            <div>
              <span>Próximos movimentos</span>
              <h3>O que acontece com seu dinheiro agora</h3>
            </div>
            <button>Ver agenda completa</button>
          </div>

          <div className="soraia-flow__rail">
            {commitments.map((item, index) => (
              <div className="soraia-flow__item" key={item.title}>
                <div className="soraia-flow__marker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="soraia-flow__date">{item.date}</div>
                <div className="soraia-flow__copy">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                <div className="soraia-flow__amount">{item.amount}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="soraia-editorial-bottom">
          <article className="soraia-goals-editorial">
            <div className="soraia-flow__heading">
              <div>
                <span>Objetivos</span>
                <h3>Metas que continuam avançando</h3>
              </div>
              <button>Nova meta</button>
            </div>

            <div className="soraia-goals-editorial__list">
              {goals.map((goal, index) => (
                <div className="soraia-goals-editorial__item" key={goal.title}>
                  <div className="soraia-goals-editorial__index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="soraia-goals-editorial__content">
                    <div>
                      <strong>{goal.title}</strong>
                      <span>{goal.percent}%</span>
                    </div>
                    <div className="soraia-goals-editorial__bar">
                      <span style={{ width: `${goal.percent}%` }} />
                    </div>
                    <small>
                      {goal.current}
                      <span>Meta: {goal.target}</span>
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="soraia-conversation">
            <div className="soraia-conversation__badge">✦ Converse com a Soraia</div>
            <h3>Uma pergunta pode reorganizar seu mês.</h3>
            <p>
              Pergunte sobre gastos, metas, compromissos ou peça um plano personalizado.
            </p>

            <div className="soraia-conversation__composer">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ex.: posso antecipar uma meta?"
              />
              <button onClick={() => setMessage("")}>→</button>
            </div>

            <div className="soraia-conversation__suggestions">
              <button onClick={() => setMessage("Quanto posso gastar até sexta-feira?")}>Quanto posso gastar?</button>
              <button onClick={() => setMessage("Qual meta devo priorizar agora?")}>Qual meta priorizar?</button>
            </div>
          </article>
        </section>
      </div>
    </>
  );
}
