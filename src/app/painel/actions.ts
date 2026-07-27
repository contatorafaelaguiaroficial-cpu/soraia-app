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
