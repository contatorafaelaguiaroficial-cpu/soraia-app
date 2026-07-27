"use client";

import { useState } from "react";

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
          <button aria-label="Pesquisar">⌕</button>
          <button aria-label="Notificações">◌</button>
        </div>
      </header>

      <div className="soraia-home">
        <section className="soraia-home__hero-grid">
          <article className="soraia-home__hero">
            <span className="soraia-home__status">● Sua assistente está pronta</span>
            <h2>
              Seu dinheiro faz mais sentido quando <em>você enxerga o todo.</em>
            </h2>
            <p>
              A Soraia conecta suas contas, compromissos e objetivos para transformar números em decisões mais simples.
            </p>

            <div className="soraia-home__composer">
              <span>✦</span>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Pergunte algo sobre sua vida financeira"
              />
              <button onClick={() => setMessage("")}>→</button>
            </div>

            <div className="soraia-home__suggestions">
              {[
                "Quanto posso gastar esta semana?",
                "O que vence nos próximos dias?",
                "Como estão minhas metas?",
              ].map((item) => (
                <button key={item} onClick={() => setMessage(item)}>
                  {item}
                </button>
              ))}
            </div>
          </article>

          <aside className="soraia-card soraia-insights">
            <span>Leitura do dia</span>
            <h3>O que merece sua atenção</h3>
            {[
              ["Aluguel vence amanhã", "R$ 1.800,00 já está considerado no saldo disponível."],
              ["Seu ritmo de gastos melhorou", "Você gastou 12% menos que na mesma semana do mês passado."],
              ["Uma meta pode ser antecipada", "Seu caixa permite aumentar o aporte em R$ 250,00 neste mês."],
            ].map(([title, description]) => (
              <div className="soraia-insights__item" key={title}>
                <div>✦</div>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </aside>
        </section>

        <section className="soraia-home__overview">
          <article className="soraia-card soraia-balance">
            <div>
              <span>Patrimônio consolidado</span>
              <h3>R$ 154.320,00</h3>
              <small>↑ 4,2% neste mês</small>

              <div className="soraia-balance__stats">
                <div><span>Disponível</span><strong>R$ 8.450,00</strong></div>
                <div><span>Investido</span><strong>R$ 97.680,00</strong></div>
                <div><span>Metas</span><strong>R$ 48.190,00</strong></div>
              </div>
            </div>

            <div className="soraia-balance__chart">
              <svg viewBox="0 0 280 150" preserveAspectRatio="none">
                <path d="M0 112 C25 106,32 98,52 101 C73 104,83 84,107 86 C132 88,144 62,166 67 C190 72,203 51,222 54 C245 58,255 35,280 28" />
              </svg>
            </div>
          </article>

          <article className="soraia-card soraia-agenda">
            <div className="soraia-card__heading">
              <div>
                <span>Agenda financeira</span>
                <h3>Próximos compromissos</h3>
              </div>
              <small>3 esta semana</small>
            </div>

            {[
              ["28", "Jul", "Aluguel", "Conta principal", "R$ 1.800,00"],
              ["30", "Jul", "Internet", "Débito automático", "R$ 139,00"],
              ["02", "Ago", "Aporte mensal", "Reserva de emergência", "R$ 750,00"],
            ].map(([day, month, title, subtitle, amount]) => (
              <div className="soraia-agenda__item" key={title}>
                <div><strong>{day}</strong><span>{month}</span></div>
                <div><strong>{title}</strong><span>{subtitle}</span></div>
                <strong>{amount}</strong>
              </div>
            ))}
          </article>
        </section>

        <section className="soraia-home__bottom">
          <article className="soraia-card">
            <div className="soraia-card__heading">
              <h3>O que a Soraia organizou</h3>
              <button>Ver histórico</button>
            </div>

            {[
              ["Salário identificado e distribuído", "A previsão do mês foi recalculada automaticamente.", "09:42"],
              ["Pix de R$ 250,00 categorizado", "Movimentação classificada como transporte.", "08:15"],
              ["Economia detectada em alimentação", "Seus gastos ficaram R$ 83,00 abaixo da média.", "Ontem"],
            ].map(([title, description, time]) => (
              <div className="soraia-activity" key={title}>
                <div>✦</div>
                <div><strong>{title}</strong><p>{description}</p></div>
                <span>{time}</span>
              </div>
            ))}
          </article>

          <article className="soraia-card">
            <div className="soraia-card__heading">
              <h3>Metas em andamento</h3>
              <button>Nova meta</button>
            </div>

            {[
              ["Reserva de emergência", 78, "R$ 23.400,00", "R$ 30.000,00"],
              ["Viagem em família", 54, "R$ 8.100,00", "R$ 15.000,00"],
              ["Novo apartamento", 31, "R$ 18.600,00", "R$ 60.000,00"],
            ].map(([title, percent, current, target]) => (
              <div className="soraia-goal" key={String(title)}>
                <div><strong>{title}</strong><span>{percent}%</span></div>
                <div className="soraia-goal__bar"><span style={{ width: `${percent}%` }} /></div>
                <small><span>{current}</span><span>Meta: {target}</span></small>
              </div>
            ))}
          </article>
        </section>
      </div>
    </>
  );
}
