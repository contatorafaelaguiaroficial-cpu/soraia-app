"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarMeta(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const nome = String(formData.get("nome") ?? "").trim();
  const valorMeta = Number(formData.get("valor_meta"));

  if (!nome || !valorMeta || valorMeta <= 0) return;

  await supabase.from("metas").insert({
    user_id: user.id,
    nome,
    valor_meta: valorMeta,
    valor_atual: 0,
  });

  revalidatePath("/painel");
}

export async function criarAporte(metaId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const valor = Number(formData.get("valor"));
  if (!valor || valor <= 0) return;

  const { data: meta } = await supabase
    .from("metas")
    .select("id, valor_atual")
    .eq("id", metaId)
    .eq("user_id", user.id)
    .single();

  if (!meta) return;

  await supabase.from("aportes_meta").insert({ meta_id: metaId, valor });

  await supabase
    .from("metas")
    .update({ valor_atual: Number(meta.valor_atual) + valor })
    .eq("id", metaId);

  revalidatePath(`/painel/metas/${metaId}`);
  revalidatePath("/painel");
}

