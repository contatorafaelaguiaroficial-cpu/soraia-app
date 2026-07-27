"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AssistantDock({ collapsed }: { collapsed: boolean }) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  function submit() {
    const texto = message.trim();

    if (!texto) {
      router.push("/painel/assistente");
      return;
    }

    router.push(
      `/painel/assistente?mensagem=${encodeURIComponent(texto)}`,
    );

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
