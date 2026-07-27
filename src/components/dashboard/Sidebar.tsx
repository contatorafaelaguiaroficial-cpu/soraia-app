"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const items = [
  { href: "/painel", label: "Visão geral", icon: "home" },
  { href: "/painel/assistente", label: "Assistente", icon: "chat" },
  { href: "/painel/agenda", label: "Agenda", icon: "calendar" },
  { href: "/painel/financas", label: "Finanças", icon: "wallet" },
  { href: "/painel/metas", label: "Metas", icon: "target" },
  { href: "/painel/investimentos", label: "Investimentos", icon: "chart" },
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg {...common}>
        <path d="M6 17.5 4.5 20l3.5-.8A8 8 0 1 0 6 17.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "wallet") {
    return (
      <svg {...common}>
        <rect x="4" y="6" width="16" height="13" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10h16M8 14h3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m5 17 5-5 3 3 6-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h4v4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="soraia-sidebar">
      <div className="soraia-sidebar__brand">
        <div className="soraia-sidebar__logo">S</div>
        <strong>Soraia</strong>
        <span>Beta</span>
      </div>

      <button
        type="button"
        className="soraia-sidebar__toggle"
        onClick={onToggle}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d={collapsed ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <nav className="soraia-sidebar__nav">
        {items.map((item) => {
          const active =
            item.href === "/painel"
              ? pathname === "/painel"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`soraia-sidebar__link ${active ? "is-active" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="soraia-sidebar__profile">
        <div className="soraia-sidebar__avatar">RA</div>
        <div>
          <strong>Rafael Aguiar</strong>
          <span>Soraia Pro</span>
        </div>
      </div>
    </aside>
  );
}
