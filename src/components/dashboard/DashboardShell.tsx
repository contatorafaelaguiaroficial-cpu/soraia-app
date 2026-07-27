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
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const atualizar = () => {
      setIsMobile(mediaQuery.matches);

      if (mediaQuery.matches) {
        setCollapsed(false);
      }
    };

    atualizar();

    mediaQuery.addEventListener("change", atualizar);

    return () => {
      mediaQuery.removeEventListener("change", atualizar);
    };
  }, []);

  return (
    <div
      className={`soraia-dashboard ${
        collapsed && isMobile === false
          ? "soraia-dashboard--collapsed"
          : ""
      }`}
    >
      {isMobile === false && (
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      )}

      <main className="soraia-dashboard__main">
        {children}
      </main>

      <AssistantDock collapsed={isMobile === false && collapsed} />

      <MobileNavigation />
    </div>
  );
}
