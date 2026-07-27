"use client";

import { useState } from "react";

export default function AssistantDock({ collapsed }: { collapsed: boolean }) {
  const [message, setMessage] = useState("");

  function submit() {
    if (!message.trim()) return;
    setMessage("");
  }

  return (
    <div className={`soraia-dock ${collapsed ? "soraia-dock--collapsed" : ""}`}>
      <div className="soraia-dock__icon">✦</div>

      <input
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") submit();
        }}
        placeholder="Converse com a Soraia"
      />

      <button type="button" aria-label="Anexar arquivo">
        +
      </button>

      <button type="button" className="is-primary" onClick={submit} aria-label="Enviar">
        →
      </button>
    </div>
  );
}
