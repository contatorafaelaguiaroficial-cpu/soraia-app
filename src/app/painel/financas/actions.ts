"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type EstadoMovimentacao = {
  erro?: string;
  sucesso?: string;
};

function obterHojeBrasil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function criarMovimentacao(
  _estadoAnterior: EstadoMovimentacao,
  formData: FormData
): Promise<EstadoMovimentacao> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Você precisa estar conectado." };
  }

  const tipo = String(formData.get("tipo") || "");
  const descricao = String(formData.get("descricao") || "").trim();
  const categoria = String(formData.get("categoria") || "Outros").trim();
  const data = String(formData.get("data") || "");
  const recorrente = formData.get("recorrente") === "on";

  const valorTexto = String(formData.get("valor") || "")
    .replace(/\s/g, "")
    .replace(/^R\$/, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const valor = Number(valorTexto);

  if (tipo !== "receita" && tipo !== "despesa") {
    return { erro: "Selecione receita ou despesa." };
  }

  if (!descricao) {
    return { erro: "Informe uma descrição." };
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    return { erro: "Informe um valor válido." };
  }

  if (!data) {
    return { erro: "Informe a data." };
  }

  const hoje = obterHojeBrasil();

  const status =
    data > hoje
      ? "pendente"
      : tipo === "receita"
        ? "recebido"
        : "pago";

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    tipo,
    descricao,
    valor,
    categoria: categoria || "Outros",
    data,
    recorrente,
    status,
  });

  if (error) {
    console.error("Erro ao criar movimentação:", error);

    return {
      erro: `Não foi possível salvar: ${error.message}`,
    };
  }

  revalidatePath("/painel");
  revalidatePath("/painel/financas");
  revalidatePath("/painel/agenda");

  return {
    sucesso:
      status === "pendente"
        ? "Movimentação agendada."
        : "Movimentação registrada.",
  };
}

export async function efetivarMovimentacao(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const id = String(formData.get("id") || "");
  const tipo = String(formData.get("tipo") || "");

  if (!id || (tipo !== "receita" && tipo !== "despesa")) {
    return;
  }

  const novoStatus = tipo === "receita" ? "recebido" : "pago";

  const { error } = await supabase
    .from("transactions")
    .update({ status: novoStatus })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao efetivar movimentação:", error);
    return;
  }

  revalidatePath("/painel");
  revalidatePath("/painel/financas");
  revalidatePath("/painel/agenda");
}

export async function excluirMovimentacao(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const id = String(formData.get("id") || "");

  if (!id) return;

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao excluir movimentação:", error);
    return;
  }

  revalidatePath("/painel");
  revalidatePath("/painel/financas");
  revalidatePath("/painel/agenda");
}
