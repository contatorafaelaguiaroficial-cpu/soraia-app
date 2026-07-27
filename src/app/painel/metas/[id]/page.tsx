import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Target, PiggyBank } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import NovoAporteForm from "@/components/NovoAporteForm";
import MetaActions from "@/components/MetaActions";
import { Card, CircularProgress, INK, MUTED } from "@/components/ui";

const PURPLE = "#8B5CF6";

type Aporte = {
  id: string;
  valor: number;
  created_at: string;
};

export default async function MetaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: meta } = await supabase
    .from("metas")
    .select("id, nome, valor_atual, valor_meta")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!meta) {
    notFound();
  }

  const { data: aportes } = await supabase
    .from("aportes_meta")
    .select("id, valor, created_at")
    .eq("meta_id", id)
    .order("created_at", { ascending: false });

  const listaAportes = (aportes ?? []) as Aporte[];
  const pct = meta.valor_meta > 0 ? Math.round((meta.valor_atual / meta.valor_meta) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#0F0C14", fontFamily: "'Nunito', sans-serif" }}>
      <header className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link
          href="/painel/metas"
          className="flex items-center justify-center rounded-2xl"
          style={{ width: 40, height: 40, background: "#1C1723", border: "1.5px solid rgba(255,255,255,0.09)" }}
        >
          <ChevronLeft size={18} color={INK} strokeWidth={2.4} />
        </Link>
        <span style={{ color: INK, fontWeight: 800, fontSize: 14 }}>Meta</span>
      </header>

      <main className="px-6 py-8 max-w-md mx-auto">
        <div className="flex flex-col items-center text-center mb-7">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 54,
              height: 54,
              background:
                "linear-gradient(155deg, #8B5CF6, #6D28D9)",
              boxShadow:
                "0 6px 14px rgba(109,40,217,0.32)",
            }}
          >
            <Target
              size={25}
              color="#FFFFFF"
              strokeWidth={2.2}
            />
          </div>
          <div className="mt-4" style={{ color: INK, fontWeight: 800, fontSize: 16 }}>{meta.nome}</div>
          <div className="mt-2" style={{ color: PURPLE, fontSize: 40, fontWeight: 900 }}>{pct}%</div>

          <div className="w-full flex items-center justify-center my-4">
            <CircularProgress pct={pct} size={140} stroke={10} tone="nectarine" />
          </div>

          <div className="flex items-center justify-between w-full mt-1">
            <span style={{ color: MUTED, fontWeight: 700, fontSize: 12 }}>
              R$ {Number(meta.valor_atual).toLocaleString("pt-BR")}
            </span>
            <span style={{ color: MUTED, fontWeight: 700, fontSize: 12 }}>
              R$ {Number(meta.valor_meta).toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        <MetaActions
          metaId={meta.id}
          nomeAtual={meta.nome}
          valorAtual={Number(meta.valor_meta)}
        />

        <NovoAporteForm metaId={meta.id} />

        <div className="flex items-center justify-between mt-8 mb-3">
          <span style={{ color: INK, fontWeight: 800, fontSize: 14 }}>Histórico de aportes</span>
          <span style={{ color: MUTED, fontWeight: 700, fontSize: 11 }}>{listaAportes.length}</span>
        </div>

        {listaAportes.length === 0 ? (
          <Card>
            <span style={{ color: MUTED, fontWeight: 600, fontSize: 13, lineHeight: 1.6 }}>
              Nenhum aporte ainda. Adiciona o primeiro valor ali em cima.
            </span>
          </Card>
        ) : (
          <Card>
            {listaAportes.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center justify-between py-3"
                style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      width: 32,
                      height: 32,
                      background:
                        "linear-gradient(155deg, #96C7B3, #6BA48D)",
                      boxShadow:
                        "0 5px 12px rgba(107,164,141,0.28)",
                    }}
                  >
                    <PiggyBank
                      size={15}
                      color="#FFFFFF"
                      strokeWidth={2.2}
                    />
                  </div>
                  <span style={{ color: INK, fontWeight: 700, fontSize: 13 }}>
                    {new Date(a.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                  </span>
                </div>
                <span style={{ color: "#6BA48D", fontWeight: 800, fontSize: 13 }}>
                  + R$ {Number(a.valor).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </Card>
        )}
      </main>
    </div>
  );
}
