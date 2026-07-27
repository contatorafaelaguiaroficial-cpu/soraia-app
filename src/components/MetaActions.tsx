"use client";

import {
  Check,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

import {
  editarMeta,
  excluirMeta,
} from "@/app/painel/actions";

type Props = {
  metaId: string;
  nomeAtual: string;
  valorAtual: number;
  prazoAtual: string | null;
};

export default function MetaActions({
  metaId,
  nomeAtual,
  valorAtual,
  prazoAtual,
}: Props) {
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function salvar(formData: FormData) {
    setSalvando(true);
    setErro("");

    const resultado = await editarMeta(
      metaId,
      formData,
    );

    if (!resultado?.sucesso) {
      setErro(
        resultado?.erro ||
          "Não foi possível salvar a meta.",
      );
      setSalvando(false);
      return;
    }

    setSalvando(false);
    setEditando(false);
  }

  async function excluir() {
    const confirmado = window.confirm(
      "Tem certeza que deseja excluir esta meta? Todo o histórico de aportes também será apagado.",
    );

    if (!confirmado) return;

    setExcluindo(true);
    await excluirMeta(metaId);
  }

  if (editando) {
    return (
      <div
        className="rounded-[22px] p-5 mb-5"
        style={{
          background: "#1C1723",
          border:
            "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <strong
            style={{
              color: "#F4F1F8",
              fontSize: 14,
            }}
          >
            Editar meta
          </strong>

          <button
            type="button"
            onClick={() => {
              setEditando(false);
              setErro("");
            }}
            aria-label="Cancelar edição"
          >
            <X size={18} color="#9C93AC" />
          </button>
        </div>

        <form action={salvar}>
          <input
            name="nome"
            defaultValue={nomeAtual}
            required
            className="w-full mb-3 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "#241E2D",
              color: "#F4F1F8",
              border:
                "1px solid rgba(255,255,255,0.09)",
            }}
          />

          <input
            name="valor_meta"
            type="number"
            step="0.01"
            min="1"
            defaultValue={valorAtual}
            required
            className="w-full mb-3 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "#241E2D",
              color: "#F4F1F8",
              border:
                "1px solid rgba(255,255,255,0.09)",
            }}
          />

          <label
            className="block mb-2"
            style={{
              color: "#9C93AC",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Prazo para alcançar a meta
          </label>

          <input
            name="prazo"
            type="date"
            defaultValue={prazoAtual ?? ""}
            className="w-full mb-3 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "#241E2D",
              color: "#F4F1F8",
              border:
                "1px solid rgba(255,255,255,0.09)",
              colorScheme: "dark",
            }}
          />

          {erro && (
            <p
              style={{
                color: "#ff8b98",
                fontSize: 12,
                marginBottom: 12,
              }}
            >
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="w-full rounded-full py-3 flex items-center justify-center gap-2 font-extrabold text-sm text-white"
            style={{
              background: salvando
                ? "#4A3B6B"
                : "linear-gradient(155deg, #8B5CF6, #6D28D9)",
            }}
          >
            <Check size={16} />

            {salvando
              ? "Salvando..."
              : "Salvar alterações"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <button
        type="button"
        onClick={() => setEditando(true)}
        className="rounded-full py-3 flex items-center justify-center gap-2 font-bold text-sm"
        style={{
          color: "#B9A5F5",
          background: "rgba(139,92,246,0.10)",
          border:
            "1px solid rgba(139,92,246,0.22)",
        }}
      >
        <Pencil size={15} />
        Editar meta
      </button>

      <button
        type="button"
        onClick={excluir}
        disabled={excluindo}
        className="rounded-full py-3 flex items-center justify-center gap-2 font-bold text-sm"
        style={{
          color: "#FF8B98",
          background: "rgba(255,74,94,0.08)",
          border:
            "1px solid rgba(255,74,94,0.18)",
        }}
      >
        <Trash2 size={15} />

        {excluindo ? "Excluindo..." : "Excluir"}
      </button>
    </div>
  );
}
