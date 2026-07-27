import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  RegistrarTransacaoArgs,
  StatusTransacao,
} from "@/lib/soraia/types";

function normalizarStatus(
  tipo: RegistrarTransacaoArgs["tipo"],
  status: StatusTransacao,
): StatusTransacao {
  if (tipo === "despesa" && status === "recebido") {
    return "pago";
  }

  if (tipo === "receita" && status === "pago") {
    return "recebido";
  }

  return status;
}

function dataValida(data: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(data);
}

export async function registrarTransacao(params: {
  supabase: SupabaseClient;
  userId: string;
  argumentos: RegistrarTransacaoArgs;
  hoje: string;
}) {
  const { supabase, userId, argumentos, hoje } = params;

  const valor = Number(argumentos.valor);

  if (!Number.isFinite(valor) || valor <= 0) {
    return {
      sucesso: false as const,
      erro: "O valor da transação precisa ser maior que zero.",
    };
  }

  const descricao = String(argumentos.descricao ?? "").trim();

  if (!descricao) {
    return {
      sucesso: false as const,
      erro: "A descrição da transação não foi informada.",
    };
  }

  const data =
    argumentos.data && dataValida(argumentos.data)
      ? argumentos.data
      : hoje;

  const transacao = {
    user_id: userId,
    tipo: argumentos.tipo,
    descricao,
    valor,
    categoria: String(argumentos.categoria || "Outros").trim(),
    data,
    status: normalizarStatus(
      argumentos.tipo,
      argumentos.status,
    ),
  };

  const { data: criada, error } = await supabase
    .from("transactions")
    .insert(transacao)
    .select("tipo, descricao, valor, categoria, data, status")
    .single();

  if (error) {
    console.error("Erro ao registrar transação:", error);

    return {
      sucesso: false as const,
      erro: "Não foi possível salvar a transação.",
    };
  }

  return {
    sucesso: true as const,
    transacao: criada as RegistrarTransacaoArgs,
  };
}
