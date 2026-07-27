"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import AssistantDock from "./AssistantDock";
import MobileNavigation from "./MobileNavigation";
import Sidebar from "./Sidebar";

import "./dashboard.css";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    function atualizarTela(event?: MediaQueryListEvent) {
      const mobile = event ? event.matches : mediaQuery.matches;

      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(false);
      }

      setReady(true);
    }

    atualizarTela();

    mediaQuery.addEventListener("change", atualizarTela);

    return () => {
      mediaQuery.removeEventListener("change", atualizarTela);
    };
  }, []);

  return (
    <div
      className={[
        "soraia-dashboard",
        collapsed && !isMobile ? "soraia-dashboard--collapsed" : "",
        isMobile ? "soraia-dashboard--mobile" : "",
        ready ? "soraia-dashboard--ready" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      )}

      <main className="soraia-dashboard__main">{children}</main>

      <AssistantDock collapsed={isMobile ? false : collapsed} />

      <MobileNavigation />
    </div>
  );
}
