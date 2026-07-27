import { redirect } from "next/navigation";
import { Sparkles, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SairButton from "@/components/SairButton";
import NovaMetaForm from "@/components/NovaMetaForm";
import Link from "next/link";
import { Card, CircularProgress, INK, MUTED } from "@/components/ui";

const PURPLE = "#8B5CF6";
const PURPLE_DARK = "#6D28D9";

type Meta = {
  id: string;
  nome: string;
  valor_atual: number;
  valor_meta: number;
};

export default async function PainelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: metas } = await supabase
    .from("metas")
    .select("id, nome, valor_atual, valor_meta")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const nome = (user.user_metadata?.nome as string | undefined) ?? user.email?.split("@")[0] ?? "";
  const listaMetas = (metas ?? []) as Meta[];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0F0C14", fontFamily: "'Nunito', sans-serif" }}>
      <div
        className="fixed pointer-events-none"
        style={{ top: -120, left: -120, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%)" }}
      />
      <div
        className="fixed pointer-events-none"
        style={{ bottom: -140, right: -140, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,152,169,0.14), transparent 70%)" }}
      />

      <header className="flex items-center justify-between px-6 py-5 relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 36, height: 36, background: `linear-gradient(155deg, ${PURPLE}, ${PURPLE_DARK})` }}
          >
            <Sparkles size={17} color="#FFFFFF" strokeWidth={2.2} />
          </div>
          <span style={{ color: INK, fontWeight: 900, fontSize: 17 }}>soraia</span>
        </div>
        <SairButton />
      </header>

      <main className="px-6 py-8 relative max-w-2xl mx-auto">
        <h1 style={{ color: INK, fontWeight: 900, fontSize: 26 }}>Oi, {nome} 👋</h1>
        <p className="mt-1.5 text-sm" style={{ color: MUTED, fontWeight: 600 }}>
          Aqui vai ficar seu resumo de finanças, agenda e planos.
        </p>

        <div
          className="mt-7 rounded-[26px] p-6 relative overflow-hidden"
          style={{ background: `linear-gradient(155deg, ${PURPLE} 0%, ${PURPLE_DARK} 85%)`, boxShadow: "0 16px 30px rgba(109,40,217,0.30)" }}
        >
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <span className="text-[12px] relative" style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>SALDO EM CONTAS</span>
          <div className="mt-1.5 relative" style={{ color: "#FFFFFF", fontSize: 34, fontWeight: 900 }}>R$ 0,00</div>
          <div className="mt-2 relative">
            <span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>
              Nenhum lançamento ainda. Isso vai chegar quando o registro pelo WhatsApp estiver pronto.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 mb-3">
          <span style={{ color: INK, fontWeight: 800, fontSize: 15 }}>Suas metas 🎯</span>
          <span style={{ color: MUTED, fontWeight: 700, fontSize: 11 }}>{listaMetas.length} ativas</span>
        </div>

        <div className="space-y-3">
          {listaMetas.map((m) => {
            const pct = m.valor_meta > 0 ? Math.round((m.valor_atual / m.valor_meta) * 100) : 0;
            return (
              <Link key={m.id} href={`/painel/metas/${m.id}`} className="block">
                <Card className="flex items-center gap-3.5">
                  <CircularProgress pct={pct} size={50} stroke={5} tone="nectarine">
                    <Target size={18} color="#8B5CF6" strokeWidth={2.2} />
                  </CircularProgress>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span style={{ color: INK, fontWeight: 800, fontSize: 14 }}>{m.nome}</span>
                      <span style={{ color: "#8B5CF6", fontWeight: 800, fontSize: 13 }}>{pct}%</span>
                    </div>
                    <span style={{ color: MUTED, fontWeight: 700, fontSize: 11.5 }}>
                      R$ {m.valor_atual.toLocaleString("pt-BR")} de R$ {m.valor_meta.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}

          {listaMetas.length === 0 && (
            <Card>
              <span style={{ color: MUTED, fontWeight: 600, fontSize: 13, lineHeight: 1.6 }}>
                Nenhuma meta ainda. Cria a primeira aqui embaixo pra ver o dado real aparecer.
              </span>
            </Card>
          )}

          <NovaMetaForm />
        </div>
      </main>
    </div>
  );
}
