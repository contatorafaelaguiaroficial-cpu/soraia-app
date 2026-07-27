"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import AssistantDock from "./AssistantDock";
import "./dashboard.css";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`soraia-dashboard ${
        collapsed ? "soraia-dashboard--collapsed" : ""
      }`}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />

      <main className="soraia-dashboard__main">
        {children}
      </main>

      <AssistantDock collapsed={collapsed} />
      <MobileNavigation />
    </div>
  );
}
