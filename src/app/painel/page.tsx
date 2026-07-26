import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PainelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: "#0F0C14", color: "#F4F1F8" }}>
      <h1 className="text-2xl font-extrabold">Oi, {user.user_metadata?.nome ?? user.email} 👋</h1>
      <p className="mt-2 text-sm" style={{ color: "#9C93AC" }}>
        Login funcionando de verdade. Esse é o ponto de partida pra reconstruir
        o painel completo (Início, Finanças, Organização, Soraia) que já está
        validado no protótipo visual.
      </p>
    </div>
  );
}
