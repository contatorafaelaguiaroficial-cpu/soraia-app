import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  AdicionarAporteMetaArgs,
  CriarMetaArgs,
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


export async function criarMetaSoraia(params: {
  supabase: SupabaseClient;
  userId: string;
  argumentos: CriarMetaArgs;
}) {
  const {
    supabase,
    userId,
    argumentos,
  } = params;

  const nome = String(
    argumentos.nome ?? "",
  ).trim();

  const valorMeta = Number(
    argumentos.valor_meta,
  );

  const prazoInformado = String(
    argumentos.prazo ?? "",
  ).trim();

  const prazo =
    prazoInformado &&
    dataValida(prazoInformado)
      ? prazoInformado
      : null;

  if (!nome) {
    return {
      sucesso: false as const,
      erro: "O nome da meta não foi informado.",
    };
  }

  if (
    !Number.isFinite(valorMeta) ||
    valorMeta <= 0
  ) {
    return {
      sucesso: false as const,
      erro:
        "O valor da meta precisa ser maior que zero.",
    };
  }

  const { data: criada, error } =
    await supabase
      .from("metas")
      .insert({
        user_id: userId,
        nome,
        valor_meta: valorMeta,
        valor_atual: 0,
        prazo,
      })
      .select(
        "id, nome, valor_atual, valor_meta, prazo",
      )
      .single();

  if (error) {
    console.error(
      "Erro ao criar meta pela Soraia:",
      error,
    );

    return {
      sucesso: false as const,
      erro: "Não foi possível criar a meta.",
    };
  }

  return {
    sucesso: true as const,
    meta: criada,
  };
}

export async function adicionarAporteMetaSoraia(
  params: {
    supabase: SupabaseClient;
    userId: string;
    argumentos: AdicionarAporteMetaArgs;
  },
) {
  const {
    supabase,
    userId,
    argumentos,
  } = params;

  const nomeMeta = String(
    argumentos.nome_meta ?? "",
  ).trim();

  const valor = Number(argumentos.valor);

  if (!nomeMeta) {
    return {
      sucesso: false as const,
      erro:
        "O nome da meta não foi informado.",
    };
  }

  if (
    !Number.isFinite(valor) ||
    valor <= 0
  ) {
    return {
      sucesso: false as const,
      erro:
        "O valor do aporte precisa ser maior que zero.",
    };
  }

  const termoSeguro = nomeMeta
    .replace(/[%_]/g, "")
    .trim();

  const { data: metas, error: erroBusca } =
    await supabase
      .from("metas")
      .select(
        "id, nome, valor_atual, valor_meta, prazo",
      )
      .eq("user_id", userId)
      .ilike("nome", `%${termoSeguro}%`)
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

  if (erroBusca) {
    console.error(
      "Erro ao localizar meta:",
      erroBusca,
    );

    return {
      sucesso: false as const,
      erro:
        "Não foi possível localizar a meta.",
    };
  }

  if (!metas || metas.length === 0) {
    return {
      sucesso: false as const,
      erro: `Não encontrei uma meta chamada "${nomeMeta}".`,
    };
  }

  if (metas.length > 1) {
    return {
      sucesso: false as const,
      erro:
        "Encontrei mais de uma meta parecida. Informe um nome mais específico.",
    };
  }

  const meta = metas[0];
  const novoValor =
    Number(meta.valor_atual) + valor;

  const { error: erroAporte } =
    await supabase
      .from("aportes_meta")
      .insert({
        meta_id: meta.id,
        valor,
      });

  if (erroAporte) {
    console.error(
      "Erro ao registrar aporte:",
      erroAporte,
    );

    return {
      sucesso: false as const,
      erro:
        "Não foi possível registrar o aporte.",
    };
  }

  const { error: erroAtualizacao } =
    await supabase
      .from("metas")
      .update({
        valor_atual: novoValor,
      })
      .eq("id", meta.id)
      .eq("user_id", userId);

  if (erroAtualizacao) {
    console.error(
      "Erro ao atualizar valor da meta:",
      erroAtualizacao,
    );

    await supabase
      .from("aportes_meta")
      .delete()
      .eq("meta_id", meta.id)
      .eq("valor", valor);

    return {
      sucesso: false as const,
      erro:
        "Não foi possível atualizar a meta.",
    };
  }

  return {
    sucesso: true as const,
    meta: {
      ...meta,
      valor_atual: novoValor,
    },
    valor_aporte: valor,
  };
}
