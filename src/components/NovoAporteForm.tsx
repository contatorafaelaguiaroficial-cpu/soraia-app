"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { criarAporte } from "@/app/painel/actions";
import { CARD_BORDER, MUTED, INK, NECTARINE, NECTARINE_DARK } from "@/components/ui";

export default function NovoAporteForm({ metaId }: { metaId: string }) {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setEnviando(true);
    await criarAporte(metaId, formData);
    setEnviando(false);
    setAberto(false);
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="w-full rounded-full py-3.5 flex items-center justify-center gap-2 font-extrabold text-[14px] text-white transition-transform active:scale-[0.98]"
        style={{ background: `linear-gradient(155deg, ${NECTARINE}, ${NECTARINE_DARK})` }}
      >
        <Plus size={16} strokeWidth={2.4} />
        Adicionar valor
      </button>
    );
  }

  return (
    <div className="rounded-[22px] p-5" style={{ background: "#1C1723", border: `1px solid ${CARD_BORDER}` }}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ color: INK, fontWeight: 800, fontSize: 14 }}>Adicionar valor</span>
        <button onClick={() => setAberto(false)}>
          <X size={16} color={MUTED} />
        </button>
      </div>
      <form action={handleSubmit}>
        <input
          name="valor"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Valor do aporte (R$)"
          required
          autoFocus
          className="w-full mb-4 rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: "#241E2D", color: INK, border: `1px solid ${CARD_BORDER}` }}
        />
        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-full py-3 font-extrabold text-sm text-white transition-transform active:scale-[0.98]"
          style={{ background: enviando ? "#4A3B6B" : `linear-gradient(155deg, ${NECTARINE}, ${NECTARINE_DARK})` }}
        >
          {enviando ? "Salvando..." : "Confirmar aporte"}
        </button>
      </form>
    </div>
  );
}
