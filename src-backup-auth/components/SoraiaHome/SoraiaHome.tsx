"use client";

import { useState } from "react";
import "./SoraiaHome.css";

const suggestions = [
  "Quanto posso gastar esta semana?",
  "O que vence nos próximos dias?",
  "Como estão minhas metas?",
];

export default function SoraiaHome() {
  const [heroMessage, setHeroMessage] = useState("");
  const [dockMessage, setDockMessage] = useState("");
  const [toast, setToast] = useState("");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function sendMessage(value: string, clear: () => void) {
    if (!value.trim()) {
      showToast("Digite uma pergunta para conversar com a Soraia.");
      return;
    }

    showToast("Mensagem enviada para a Soraia.");
    clear();
  }

  return (
    <>
      <div className="soraia-shell">
        <aside className="soraia-sidebar">
          <div className="soraia-brand">
            <div className="soraia-brand-symbol">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5.5 15.5c2.6 0 3.9-1.2 4.3-3.5.5-2.7.8-4.3 2.2-4.3s1.7 1.6 2.2 4.3c.4 2.3 1.7 3.5 4.3 3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              </svg>
            </div>
            <div className="soraia-brand-name">Soraia</div>
            <div className="soraia-brand-badge">Beta</div>
          </div>

          <div className="soraia-nav-group">
            <div className="soraia-nav-label">Principal</div>
            <nav className="soraia-nav">
              <a className="soraia-nav-link active" href="#">
                <svg className="soraia-nav-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span>Visão geral</span>
              </a>

              <a className="soraia-nav-link" href="#">
                <svg className="soraia-nav-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 17.5 4.5 20l3.5-.8A8 8 0 1 0 6 17.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Assistente</span>
              </a>

              <a className="soraia-nav-link" href="#">
                <svg className="soraia-nav-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span>Agenda</span>
              </a>

              <a className="soraia-nav-link" href="#">
                <svg className="soraia-nav-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="6" width="16" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4 10h16M8 14h3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span>Finanças</span>
              </a>
            </nav>
          </div>

          <div className="soraia-nav-group">
            <div className="soraia-nav-label">Planejamento</div>
            <nav className="soraia-nav">
              <a className="soraia-nav-link" href="#">
                <svg className="soraia-nav-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span>Metas</span>
              </a>

              <a className="soraia-nav-link" href="#">
                <svg className="soraia-nav-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="m5 17 5-5 3 3 6-8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M15 7h4v4" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span>Investimentos</span>
              </a>
            </nav>
          </div>

          <div className="soraia-sidebar-footer">
            <div className="soraia-profile">
              <div className="soraia-avatar">RA</div>
              <div className="soraia-profile-meta">
                <strong>Rafael Aguiar</strong>
                <span>Soraia Pro</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="soraia-main">
          <header className="soraia-topbar">
            <div>
              <div className="soraia-eyebrow">Segunda-feira, 27 de julho</div>
              <h1>Bom dia, Rafael.</h1>
            </div>

            <div className="soraia-top-actions">
              <button className="soraia-ghost-btn" aria-label="Pesquisar">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <button className="soraia-ghost-btn" aria-label="Notificações">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9a6 6 0 0 1 12 0v5l2 2H4l2-2V9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M10 19h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          <div className="soraia-content">
            <section className="soraia-hero-grid">
              <article className="soraia-hero">
                <div className="soraia-hero-content">
                  <div className="soraia-status">
                    <span className="soraia-status-dot" />
                    Sua assistente está pronta
                  </div>

                  <h2>
                    Seu dinheiro faz mais sentido quando <span>você enxerga o todo.</span>
                  </h2>

                  <p className="soraia-hero-copy">
                    A Soraia conecta suas contas, compromissos e objetivos para transformar números em decisões mais simples.
                  </p>

                  <div className="soraia-composer">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5.5 15.5c2.6 0 3.9-1.2 4.3-3.5.5-2.7.8-4.3 2.2-4.3s1.7 1.6 2.2 4.3c.4 2.3 1.7 3.5 4.3 3.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                    </svg>
                    <input
                      value={heroMessage}
                      onChange={(event) => setHeroMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          sendMessage(heroMessage, () => setHeroMessage(""));
                        }
                      }}
                      placeholder="Pergunte algo sobre sua vida financeira"
                    />
                    <button
                      className="soraia-send"
                      onClick={() => sendMessage(heroMessage, () => setHeroMessage(""))}
                      aria-label="Enviar"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="m8 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="soraia-suggestions">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        className="soraia-suggestion"
                        onClick={() => setHeroMessage(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </article>

              <aside className="soraia-insight-panel">
                <div className="soraia-panel-kicker">Leitura do dia</div>
                <h3>O que merece sua atenção</h3>

                <div className="soraia-insight-list">
                  <Insight
                    title="Aluguel vence amanhã"
                    description="R$ 1.800,00 já está considerado no saldo disponível."
                  />
                  <Insight
                    title="Seu ritmo de gastos melhorou"
                    description="Você gastou 12% menos que na mesma semana do mês passado."
                  />
                  <Insight
                    title="Uma meta pode ser antecipada"
                    description="Seu caixa permite aumentar o aporte em R$ 250,00 neste mês."
                  />
                </div>

                <div className="soraia-insight-footer">
                  <div className="soraia-summary-note">
                    Resumo atualizado há 4 minutos com base nas movimentações mais recentes.
                  </div>
                </div>
              </aside>
            </section>

            <section className="soraia-overview">
              <article className="soraia-balance-card">
                <div className="soraia-balance-copy">
                  <small>Patrimônio consolidado</small>
                  <div className="soraia-balance-value">R$ 154.320,00</div>
                  <div className="soraia-balance-delta">
                    <span>↑</span>
                    4,2% neste mês
                  </div>

                  <div className="soraia-mini-stats">
                    <MiniStat label="Disponível" value="R$ 8.450,00" />
                    <MiniStat label="Investido" value="R$ 97.680,00" />
                    <MiniStat label="Metas" value="R$ 48.190,00" />
                  </div>
                </div>

                <div className="soraia-chart-wrap">
                  <svg className="soraia-chart" viewBox="0 0 280 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="soraiaLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8063e7" />
                        <stop offset="100%" stopColor="#c2acff" />
                      </linearGradient>
                      <linearGradient id="soraiaAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9b7cff" stopOpacity=".20" />
                        <stop offset="100%" stopColor="#9b7cff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line className="soraia-chart-grid" x1="0" y1="35" x2="280" y2="35" />
                    <line className="soraia-chart-grid" x1="0" y1="75" x2="280" y2="75" />
                    <line className="soraia-chart-grid" x1="0" y1="115" x2="280" y2="115" />
                    <path
                      className="soraia-chart-area"
                      d="M0 112 C25 106,32 98,52 101 C73 104,83 84,107 86 C132 88,144 62,166 67 C190 72,203 51,222 54 C245 58,255 35,280 28 L280 150 L0 150 Z"
                    />
                    <path
                      className="soraia-chart-line"
                      d="M0 112 C25 106,32 98,52 101 C73 104,83 84,107 86 C132 88,144 62,166 67 C190 72,203 51,222 54 C245 58,255 35,280 28"
                    />
                    <circle className="soraia-chart-dot" cx="280" cy="28" r="4" />
                  </svg>
                </div>
              </article>

              <aside className="soraia-agenda-card">
                <div className="soraia-agenda-header">
                  <div>
                    <div className="soraia-panel-kicker">Agenda financeira</div>
                    <h3>Próximos compromissos</h3>
                  </div>
                  <div className="soraia-agenda-count">3 esta semana</div>
                </div>

                <div className="soraia-agenda-list">
                  <AgendaItem day="28" month="Jul" title="Aluguel" subtitle="Conta principal" amount="R$ 1.800,00" />
                  <AgendaItem day="30" month="Jul" title="Internet" subtitle="Débito automático" amount="R$ 139,00" />
                  <AgendaItem day="02" month="Ago" title="Aporte mensal" subtitle="Reserva de emergência" amount="R$ 750,00" />
                </div>
              </aside>
            </section>

            <section className="soraia-bottom-grid">
              <article className="soraia-activity">
                <div className="soraia-section-head">
                  <h3>O que a Soraia organizou</h3>
                  <button className="soraia-text-btn">Ver histórico</button>
                </div>

                <div className="soraia-activity-list">
                  <Activity title="Salário identificado e distribuído" description="A previsão do mês foi recalculada automaticamente." time="09:42" />
                  <Activity title="Pix de R$ 250,00 categorizado" description="Movimentação classificada como transporte." time="08:15" />
                  <Activity title="Economia detectada em alimentação" description="Seus gastos ficaram R$ 83,00 abaixo da média." time="Ontem" />
                </div>
              </article>

              <article className="soraia-goals">
                <div className="soraia-section-head">
                  <h3>Metas em andamento</h3>
                  <button className="soraia-text-btn">Nova meta</button>
                </div>

                <div className="soraia-goal-list">
                  <Goal title="Reserva de emergência" percent={78} current="R$ 23.400,00" target="R$ 30.000,00" />
                  <Goal title="Viagem em família" percent={54} current="R$ 8.100,00" target="R$ 15.000,00" />
                  <Goal title="Novo apartamento" percent={31} current="R$ 18.600,00" target="R$ 60.000,00" />
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>

      <div className="soraia-assistant-dock">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M5.5 15.5c2.6 0 3.9-1.2 4.3-3.5.5-2.7.8-4.3 2.2-4.3s1.7 1.6 2.2 4.3c.4 2.3 1.7 3.5 4.3 3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </svg>

        <input
          value={dockMessage}
          onChange={(event) => setDockMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage(dockMessage, () => setDockMessage(""));
            }
          }}
          placeholder="Converse com a Soraia"
        />

        <div className="soraia-dock-actions">
          <button className="soraia-dock-btn" aria-label="Anexar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="soraia-dock-btn primary"
            onClick={() => sendMessage(dockMessage, () => setDockMessage(""))}
            aria-label="Enviar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="m8 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="soraia-mobile-bar">
        {["Início", "Assistente", "Finanças", "Metas", "Agenda"].map((item, index) => (
          <a key={item} className={`soraia-mobile-link ${index === 0 ? "active" : ""}`} href="#">
            <span className="soraia-mobile-dot" />
            {item}
          </a>
        ))}
      </nav>

      <div className={`soraia-toast ${toast ? "show" : ""}`}>{toast}</div>
    </>
  );
}

function Insight({ title, description }: { title: string; description: string }) {
  return (
    <div className="soraia-insight">
      <div className="soraia-insight-icon">✦</div>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="soraia-mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AgendaItem(props: {
  day: string;
  month: string;
  title: string;
  subtitle: string;
  amount: string;
}) {
  return (
    <div className="soraia-agenda-item">
      <div className="soraia-date-pill">
        <div>
          <strong>{props.day}</strong>
          <span>{props.month}</span>
        </div>
      </div>
      <div>
        <strong>{props.title}</strong>
        <small>{props.subtitle}</small>
      </div>
      <div className="soraia-amount">{props.amount}</div>
    </div>
  );
}

function Activity(props: { title: string; description: string; time: string }) {
  return (
    <div className="soraia-activity-row">
      <div className="soraia-activity-mark">✦</div>
      <div>
        <strong>{props.title}</strong>
        <p>{props.description}</p>
      </div>
      <time>{props.time}</time>
    </div>
  );
}

function Goal(props: {
  title: string;
  percent: number;
  current: string;
  target: string;
}) {
  return (
    <div className="soraia-goal-item">
      <div className="soraia-goal-top">
        <strong>{props.title}</strong>
        <span>{props.percent}%</span>
      </div>
      <div className="soraia-progress">
        <span style={{ width: `${props.percent}%` }} />
      </div>
      <div className="soraia-goal-meta">
        <span>{props.current}</span>
        <span>Meta: {props.target}</span>
      </div>
    </div>
  );
}
