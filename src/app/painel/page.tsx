import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SairButton from "@/components/SairButton";

const PURPLE = "#8B5CF6";
const PURPLE_DARK = "#6D28D9";

export default async function PainelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const nome = (user.user_metadata?.nome as string | undefined) ?? user.email?.split("@")[0] ?? "";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0F0C14", fontFamily: "'Nunito', sans-serif" }}>
      <div
        className="fixed pointer-events-none"
        style={{ top: -120, left: -120, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)" }}
      />

      <header className="flex items-center justify-between px-6 py-5 relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 36, height: 36, background: `linear-gradient(155deg, ${PURPLE}, ${PURPLE_DARK})` }}
          >
            <Sparkles size={17} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <span style={{ color: "#F4F1F8", fontWeight: 900, fontSize: 17 }}>soraia</span>
        </div>
        <SairButton />
      </header>

      <main className="px-6 py-8 relative">
        <h1 style={{ color: "#F4F1F8", fontWeight: 900, fontSize: 26 }}>Oi, {nome} 👋</h1>
        <p className="mt-2 text-sm max-w-md" style={{ color: "#9C93AC", lineHeight: 1.6 }}>
          Você está logada de verdade, com sessão validada pelo servidor. As telas de Início,
          Finanças, Organização e Soraia (já validadas no protótipo visual) ainda vão ser
          reconstruídas aqui, puxando dado real em vez de exemplo.
        </p>
      </main>
    </div>
  );
}
