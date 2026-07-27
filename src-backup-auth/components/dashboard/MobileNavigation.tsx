"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/painel", "Início"],
  ["/painel/assistente", "Assistente"],
  ["/painel/financas", "Finanças"],
  ["/painel/metas", "Metas"],
  ["/painel/agenda", "Agenda"],
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="soraia-mobile-nav">
      {items.map(([href, label]) => {
        const active = href === "/painel" ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`soraia-mobile-nav__link ${active ? "is-active" : ""}`}
          >
            <span />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
